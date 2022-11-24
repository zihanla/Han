package routes

import (
	"Han/api"
	"Han/middleware"
	"Han/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Setup() {
	// 设置gin框架运行模式
	gin.SetMode(utils.AppMode)
	// 创建一个Gin实例
	r := gin.Default()
	// 分组
	auth := r.Group("admin", middleware.JwtAuth())
	// 权限组
	{
		auth.PUT("/user", api.UpdateUser) // 更新用户

		auth.POST("/tag", api.AddTag) // 添加标签

		auth.DELETE("/tag/:id", api.DelTag) // 删除标签

		auth.PUT("/tag/:id", api.UpdateTag) // 更新标签

		auth.GET("/tag", api.GetTag) // 标签列表
	}

	// 公共组
	{
		r.GET("/", func(c *gin.Context) {
			c.String(http.StatusOK, "I'm fine")
		})

		r.POST("/login", api.Login) // 登录

		r.POST("/check", api.CheckPassword) // 检查密码

	}

	// 设置服务端口
	r.Run(utils.HttpPort)
}
