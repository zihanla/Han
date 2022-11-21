package model

import (
	"gorm.io/gorm"
)

/*
	文章
*/

type Article struct {
	gorm.Model
	Title   string `gorm:"type:varchar(100);not null" json:"title"` // 标题
	Desc    string `gorm:"type:varchar(200)" json:"desc"`           // 描述
	Content string `gorm:"type:longtext;not null" json:"content"`   // 正文
	Img     string `gorm:"type:varchar(128)" json:"img"`            // 图片
}
