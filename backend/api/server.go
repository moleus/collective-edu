package api

import (
	"context"
	"github.com/gin-gonic/gin"
)

var _ ServerInterface = (*Server)(nil)

type Storage interface {
	GetSolutions(context.Context, []TaskId) ([]ProblemSolution, error)
	SaveSolutions(context.Context, []ProblemSolution) error
}

type Server struct {
	db Storage
}

func NewServer(db Storage) *Server {
	return &Server{db}
}

func (s Server) GetSolutions(c *gin.Context, params GetSolutionsParams) {
	solutions, err := s.db.GetSolutions(c, params.TaskIDs)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, solutions)
}

func (s Server) PostSolutions(c *gin.Context) {
	var solutions PostSolutionsJSONBody
	if err := c.BindJSON(&solutions); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := s.db.SaveSolutions(c, solutions); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"status": "ok"})
}
