package model

import (
	"gorm.io/gorm"
)

/*
	文章
	文章这边不给定状态了，有gorm的软删除，可以设置回收站
*/

type Article struct {
	gorm.Model
	Title   string `gorm:"type:varchar(100);not null" json:"title"` // 标题
	Desc    string `gorm:"type:varchar(255)" json:"desc"`           // 描述
	Content string `gorm:"type:longtext;not null" json:"content"`   // 正文
	Img     string `gorm:"type:varchar(255)" json:"img"`            // 图片
	Tag     []Tag  `gorm:"many2many:article_tag" json:"tag"`        // 标签关联
}
