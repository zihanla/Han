package main

import (
	"Han/dao"
	"Han/routes"
)

func main() {
	// 初始化数据库链接
	dao.Init()

	// 注册路由
	routes.Setup()
}
