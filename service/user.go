package service

import (
	"Han/dao"
	"Han/model"
	"Han/utils"
	"crypto/md5"
	"encoding/hex"
)

// Login 登录
func Login(p *model.ParamLogin) int {
	// 把前端参数赋值给 User对象
	user := model.User{
		Username: p.Username,
		Password: p.Password,
	}

	// 数据库：查找指定用户信息
	data := dao.Login(user)

	// 验证用户信息

	// 用户是否存在
	if data.ID == 0 {
		return utils.CodeUserNotExist
	}
	// 密码是否正确
	if EncryPassword(user.Password) != data.Password {
		return utils.CodeUserPasswordWrong
	}

	// 验证通过 返回成功状态码
	return utils.CodeSuccess
}

// CheckPassword 检查密码
func CheckPassword(p *model.ParamLogin) int {
	// 把前端参数赋值给 User对象
	user := model.User{
		Username: p.Username,
		Password: p.Password,
	}
	// 数据库：查找指定用户信息
	data := dao.Login(user)
	// 密码是否正确
	if EncryPassword(user.Password) != data.Password {
		return utils.CodeUserPasswordWrong
	}
	return utils.CodeSuccess
}

// UpdateUser 更新用户
func UpdateUser(p *model.ParamLogin) int {
	// 把前端参数赋值给 User对象
	user := model.User{
		Username: p.Username,
		Password: EncryPassword(p.Password), // 密码加密
	}
	err := dao.UpdateUser(user)
	if err != nil {
		return utils.CodeError
	}
	return utils.CodeSuccess
}

// EncryPassword 密码加密
func EncryPassword(oPassword string) string {
	h := md5.New()
	h.Write([]byte(utils.Secret))
	return hex.EncodeToString(h.Sum([]byte(oPassword)))
}
