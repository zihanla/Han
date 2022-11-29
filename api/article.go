package api

import (
	"Han/model"
	"Han/service"
	"Han/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

// AddArt 添加文章
func AddArt(c *gin.Context) {
	// 获取请求参数并校验
	p := new(model.ParamArticle) // new 一个指针类型的参数
	if err := c.ShouldBindJSON(p); err != nil {
		// 请求参数有误，返回响应
		utils.ResponseError(c, utils.CodeInvalidParam)
		return
	}
	// 业务处理
	if code := service.AddArt(p); code != utils.CodeSuccess {
		utils.ResponseErrorWithMsg(c, code, "添加失败")
	}
	// 返回响应
	utils.ResponseSuccess(c, "添加成功")
}

// DelArt 删除文章
func DelArt(c *gin.Context) {
	// 获取前端数据
	id, _ := strconv.Atoi(c.Param("id"))
	// 业务处理
	if code := service.DelArt(id); code != utils.CodeSuccess {
		utils.ResponseErrorWithMsg(c, code, "删除失败")
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, "删除成功")
}

// UpdateArt 更新文章
func UpdateArt(c *gin.Context) {
	// 获取请求参数并校验
	id, _ := strconv.Atoi(c.Param("id"))
	p := new(model.ParamArticle) // new 一个指针类型的参数
	if err := c.ShouldBindJSON(p); err != nil {
		// 请求参数有误，返回响应
		utils.ResponseError(c, utils.CodeInvalidParam)
		return
	}
	// 业务处理
	if code := service.UpdateArt(id, p); code != utils.CodeSuccess {
		utils.ResponseErrorWithMsg(c, code, "修改失败")
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, "修改成功")
}

// GetArt 文章列表
func GetArt(c *gin.Context) {
	// 获取前端数据
	pageSize, _ := strconv.Atoi(c.Query("pageSize"))     // 每页大小
	pageOffset, _ := strconv.Atoi(c.Query("pageOffset")) // 当前页
	// 业务处理
	code, articles, total := service.GetArt(pageSize, pageOffset)
	if code != utils.CodeSuccess {
		utils.ResponseErrorWithMsg(c, code, "获取失败")
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, gin.H{
		"articles": articles,
		"total":    total,
	})
}

// GetArtInfo 根据ID查文章
func GetArtInfo(c *gin.Context) {
	// 获取前端数据
	id, _ := strconv.Atoi(c.Param("id"))
	// 业务处理
	code, article := service.GetArtInfo(id)
	if code != utils.CodeSuccess {
		utils.ResponseErrorWithMsg(c, code, "获取失败")
		return
	}
	// 返回响应
	utils.ResponseSuccess(c, article)
}

// GetTagArt 指定标签下的所有文章
//func GetTagArt(c *gin.Context) {
//	// 获取前端数据
//	id, _ := strconv.Atoi(c.Param("id"))
//	pageSize, _ := strconv.Atoi(c.Query("pageSize"))     // 每页大小
//	pageOffset, _ := strconv.Atoi(c.Query("pageOffset")) // 当前页
//	// 业务处理
//	code, articles, total := service.GetTagArt(id, pageSize, pageOffset)
//	if code != utils.CodeSuccess {
//		utils.ResponseErrorWithMsg(c, code, "获取失败")
//		return
//	}
//	// 返回响应
//	utils.ResponseSuccess(c, gin.H{
//		"articles": articles,
//		"total":    total,
//	})
//
//}
