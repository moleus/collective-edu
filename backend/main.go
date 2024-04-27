package main

import (
	"context"
	"encoding/json"
	"github.com/Moleus/collective-edu/api"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"log"
	"os"
)

type RedisStorage struct {
	client *redis.Client
}

// GetSolutions returns solutions for given task ids
func (r *RedisStorage) GetSolutions(ctx context.Context, taskIds []api.TaskId) ([]api.ProblemSolution, error) {
	var solutions []api.ProblemSolution
	for _, taskId := range taskIds {
		data, err := r.client.LRange(ctx, "solutions:"+taskId, 0, -1).Result()
		if err != nil {
			return nil, err
		}
		for _, item := range data {
			var solution api.ProblemSolution
			if err := json.Unmarshal([]byte(item), &solution); err != nil {
				log.Printf("Error unmarshaling solution: %v\n", err)
				continue
			}
			solutions = append(solutions, solution)
		}
	}
	return solutions, nil
}

func (r *RedisStorage) SaveSolutions(ctx context.Context, solutions []api.ProblemSolution) error {
	for _, solution := range solutions {
		data, err := json.Marshal(solution)
		log.Printf("Saving solution: %s\n", data)
		if err != nil {
			return err
		}
		err = r.client.LPush(ctx, "solutions:"+solution.TaskId, data).Err()
		if err != nil {
			return err
		}
	}
	return nil
}

var (
	redisAddr = os.Getenv("REDIS_ADDR")
)

func main() {
	redisClient := redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: "",
		DB:       0,
	})

	storage := &RedisStorage{client: redisClient}
	server := api.NewServer(storage)

	router := gin.Default()

	// Add CORS middleware
	router.Use(corsMiddleware())

	api.RegisterHandlers(router, server)

	// Start serving traffic
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// corsMiddleware returns a middleware handler that handles CORS headers
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
