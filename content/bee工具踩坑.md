---
title: "bee工具踩坑"
author: "子涵"
slug: "bee-debug"
date: 2022-10-01
---

> 借助 bee 命令行工具的热编译功能，结果无法找到命令 bee 命令，还好我面向搜索引擎...

bee 是用来进行 beego 项目(普通项目也可以使用)的创建、热编译、开发、测试、和部署的工具。

我是按照 bee 官方文档进行部署的，pkg 中有 beego 包的，结果输入 bee 无法找到命令，索性搜索引擎提供了解决方案。

```go
// 通过 go env 找到path路径 进入 pkg\mod\github.com\beego\bee\vx@vx.x.x
// 在vx@vx.x.x目录下 打开终端 依次输入以下命令 对bee进行编译
	go mod tidy  // 整理bee文件
	go install // 编译bee

```

编译后只要配置过 gopath ，就可以在任意位置使用 bee 工具了。
