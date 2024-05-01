package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/Moleus/collective-edu/api"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"log"
	"os"
)

type RedisStorage struct {
	client *redis.Client
}

func (r *RedisStorage) GetSolutions(ctx context.Context, taskIds []api.TaskId) ([]api.ProblemSolution, error) {
	var solutions []api.ProblemSolution
	for _, taskId := range taskIds {
		singleTaskSolutions, err := r.client.LRange(ctx, "solutions:"+taskId, 0, -1).Result()
		if err != nil {
			log.Printf("Failed to get solutions for task %s: %v", taskId, err)
			continue
		}
		taskSolutions := r.processTaskSolutions(singleTaskSolutions)
		solutions = append(solutions, taskSolutions...)
	}
	return solutions, nil
}

func (r *RedisStorage) processTaskSolutions(solutions []string) []api.ProblemSolution {
	var incorrectSolutions []api.ProblemSolution
	for _, item := range solutions {
		var solution api.ProblemSolution
		if err := json.Unmarshal([]byte(item), &solution); err != nil {
			log.Printf("Error unmarshaling solution: %v\n", err)
			continue
		}
		if solution.IsCorrect {
			return []api.ProblemSolution{solution}
		}
		incorrectSolutions = append(incorrectSolutions, solution)
	}
	return incorrectSolutions
}

func (r *RedisStorage) SaveSolutions(ctx context.Context, solutions []api.ProblemSolution) error {
	for _, solution := range solutions {
		existingSolutions, err := r.client.LRange(ctx, "solutions:"+solution.TaskId, 0, -1).Result()
		if err != nil {
			return fmt.Errorf("failed to get existing solutions for task %s: %w", solution.TaskId, err)
		}
		for _, item := range existingSolutions {
			var existingSolution api.ProblemSolution
			if err := json.Unmarshal([]byte(item), &existingSolution); err != nil {
				log.Printf("Error unmarshaling solution: %v\n", err)
				continue
			}
			if existingSolution.IsCorrect {
				log.Printf("A correct solution already exists for task %s. Skipping saving new solution.", solution.TaskId)
				continue
			}
		}

		data, err := json.Marshal(solution)
		if err != nil {
			return fmt.Errorf("failed to marshal solution for task %s: %w", solution.TaskId, err)
		}
		err = r.client.LPush(ctx, "solutions:"+solution.TaskId, data).Err()
		if err != nil {
			return fmt.Errorf("failed to save solution for task %s: %w", solution.TaskId, err)
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
