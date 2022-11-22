package dao

import (
	"Han/model"
	"errors"
)

// Login 登录/查询
func Login(user model.User) model.User {
	// 通过用户名 查找用户信息
	db.Where("username = ?", user.Username).First(&user)
	return user
}

// UpdateUser 更新用户
func UpdateUser(user model.User) error {
	tx := db.Model(&user).Where("id = ?", 1).Updates(model.User{
		Username: user.Username,
		Password: user.Password,
	})
	// 受影响行数小于1
	if tx.RowsAffected < 1 {
		return errors.New("rows < 1")
	}
	return nil
}
