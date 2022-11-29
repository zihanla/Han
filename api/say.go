package api

import (
	"Han/model"
	"Han/service"
	"Han/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

// AddSay 添加说说
func AddSay(c *gin.Context) {
	// 获取前端数据
	p := new(model.ParamSay) // new 一个指针类型的参数
	if err := c.ShouldBindJSON(p); err != nil {
		// 请求参数有误，返回响应
		utils.ResponseError(c, utils.CodeInvalidParam)
		return
	}
	// 业务处理
	if code := service.AddSay(p); code != utils.CodeSuccess {
		utils.ResponseErrorWithMsg(c, code, "添加失败")
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, "添加成功")
}

// DelSay 删除说说
func DelSay(c *gin.Context) {
	// 获取前端数据
	id, _ := strconv.Atoi(c.Param("id"))
	// 业务处理
	if code := service.DelSay(id); code != utils.CodeSuccess {
		utils.ResponseErrorWithMsg(c, code, "删除失败")
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, "删除成功")
}

// UpdateSay 更新说说
func UpdateSay(c *gin.Context) {
	// 获取前端数据
	id, _ := strconv.Atoi(c.Param("id"))
	p := new(model.ParamSay) // new 一个指针类型的参数
	if err := c.ShouldBindJSON(p); err != nil {
		// 请求参数有误，返回响应
		utils.ResponseError(c, utils.CodeInvalidParam)
		return
	}
	// 业务处理
	if code := service.UpdateSay(id, p); code != utils.CodeSuccess {
		utils.ResponseErrorWithMsg(c, code, "修改失败")
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, "修改成功")
}

// GetSay 说说列表
func GetSay(c *gin.Context) {
	// 获取前端数据
	pageSize, _ := strconv.Atoi(c.Query("pageSize"))     // 每页大小
	pageOffset, _ := strconv.Atoi(c.Query("pageOffset")) // 当前页
	// 业务处理
	code, says := service.GetSay(pageSize, pageOffset)
	if code != utils.CodeSuccess {
		utils.ResponseErrorWithMsg(c, code, "获取失败")
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, says)
}
