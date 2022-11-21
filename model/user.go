package model

import "gorm.io/gorm"

/*
	用户
*/

type User struct {
	gorm.Model        // ID、创建、删除、修改时间
	Username   string `gorm:"type:varchar(128);not null" json:"username"` // 用户名
	Password   string `gorm:"type:varchar(128);not null" json:"password"` // 密码
}
