package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ResponseData 响应数据
type ResponseData struct {
	Code int         `json:"code"`
	Msg  interface{} `json:"msg"`
	Data interface{} `json:"data"`
}

// ResponseSuccess 成功响应
func ResponseSuccess(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, &ResponseData{
		Code: CodeSuccess,
		Msg:  GetMsg(CodeSuccess),
		Data: data,
	})
}

// ResponseError 错误响应
func ResponseError(c *gin.Context, code int) {
	c.JSON(http.StatusOK, &ResponseData{
		Code: code,
		Msg:  GetMsg(code),
		Data: nil,
	})
}

// ResponseErrorWithMsg 自定义错误信息响应
func ResponseErrorWithMsg(c *gin.Context, code int, msg interface{}) {
	c.JSON(http.StatusOK, &ResponseData{
		Code: code,
		Msg:  msg,
		Data: nil,
	})
}
