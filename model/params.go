package model

// ParamLogin 登录请求参数
type ParamLogin struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// ParamTag 标签请求参数
type ParamTag struct {
	Name string `json:"name" binding:"required"`
}
