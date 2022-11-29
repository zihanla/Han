package model

import "gorm.io/gorm"

type Say struct {
	gorm.Model
	Content string `gorm:"type:longtext;not null" json:"content"` // 正文
}
