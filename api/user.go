package api

import (
	"Han/model"
	"Han/service"
	"Han/utils"

	"github.com/gin-gonic/gin"
)

// Login 登录
func Login(c *gin.Context) {
	// 获取前端数据并校验格式
	p := new(model.ParamLogin) // new 一个指针类型的参数
	if err := c.ShouldBindJSON(p); err != nil {
		// 请求参数有误，返回响应
		utils.ResponseError(c, utils.CodeInvalidParam)
		return
	}
	// 业务处理
	// 只要状态码不为CodeSuccess 都直接返回错误信息
	if code := service.Login(p); code != utils.CodeSuccess {
		utils.ResponseError(c, code)
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, "登录成功")
}

// CheckPassword 检查密码
func CheckPassword(c *gin.Context) {
	// 获取前端数据并校验格式
	p := new(model.ParamLogin) // new 一个指针类型的参数
	if err := c.ShouldBindJSON(p); err != nil {
		// 请求参数有误，返回响应
		utils.ResponseError(c, utils.CodeInvalidParam)
		return
	}
	// 业务处理
	// 验证密码
	if code := service.CheckPassword(p); code != utils.CodeSuccess {
		utils.ResponseError(c, code)
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, nil)
}

// UpdateUser 更新用户
func UpdateUser(c *gin.Context) {
	// 获取前端数据并校验格式
	p := new(model.ParamLogin) // new 一个指针类型的参数
	if err := c.ShouldBindJSON(p); err != nil {
		// 请求参数有误，返回响应
		utils.ResponseError(c, utils.CodeInvalidParam)
		return
	}
	if len(p.Username) < 2 || len(p.Password) < 6 {
		utils.ResponseErrorWithMsg(c, utils.CodeInvalidParam, "用户名或密码太短")
		return
	}
	// 业务处理
	if code := service.UpdateUser(p); code != utils.CodeSuccess {
		utils.ResponseError(c, code)
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, "修改成功")
}
