package api

import (
	"Han/model"
	"Han/service"
	"Han/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

// 这里用请求参数的目的 是为用gin的binding:"required 参数校验 抽离出来可能比直接写在模型里好一点

// AddTag 添加标签
func AddTag(c *gin.Context) {
	// 获取前端数据并校验格式
	p := new(model.ParamTag) // new 一个指针类型的参数
	if err := c.ShouldBindJSON(p); err != nil {
		// 请求参数有误，返回响应
		utils.ResponseError(c, utils.CodeInvalidParam)
		return
	}
	// 业务处理
	if code := service.AddTag(p); code != utils.CodeSuccess {
		utils.ResponseError(c, code)
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, "添加成功")
}

// DelTag 删除标签
func DelTag(c *gin.Context) {
	// 获取前端数据并校验格式
	id, _ := strconv.Atoi(c.Param("id"))
	// 业务处理
	if code := service.DelTag(id); code != utils.CodeSuccess {
		utils.ResponseErrorWithMsg(c, code, "删除失败")
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, "删除成功")
}

// UpdateTag 更新标签
func UpdateTag(c *gin.Context) {
	// 获取前端数据并校验格式
	id, _ := strconv.Atoi(c.Param("id"))
	p := new(model.ParamTag) // new 一个指针类型的参数
	if err := c.ShouldBindJSON(p); err != nil {
		// 请求参数有误，返回响应
		utils.ResponseError(c, utils.CodeInvalidParam)
		return
	}
	// 业务处理
	if code := service.UpdateTag(id, p); code != utils.CodeSuccess {
		utils.ResponseErrorWithMsg(c, code, "更新失败")
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, "更新成功")
}

// GetTag 标签列表
func GetTag(c *gin.Context) {
	// 获取前端数据并校验格式 这次不需要
	// 业务处理
	code, data := service.GetTag()
	if code != utils.CodeSuccess {
		utils.ResponseErrorWithMsg(c, code, "查询失败")
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, data)
}
