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

// ParamArticle 文章请求参数
type ParamArticle struct {
	Title   string `json:"title" binding:"required"`   // 标题
	Desc    string `json:"desc"`                       // 描述
	Content string `json:"content" binding:"required"` // 正文
	Img     string `json:"img"`                        // 图片
	Tag     []uint `json:"tag"`                        // 标签关联
}
