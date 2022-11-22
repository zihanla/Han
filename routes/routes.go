package routes

import (
	"Han/api"
	"Han/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Setup() {
	// 设置gin框架运行模式
	gin.SetMode(utils.AppMode)
	// 创建一个Gin实例
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "I'm fine")
	})

	r.POST("/login", api.Login) // 登录

	r.POST("/check", api.CheckPassword) // 检查密码

	r.PUT("/login", api.UpdateUser) // 更新用户
	// 设置服务端口
	r.Run(utils.HttpPort)
}
