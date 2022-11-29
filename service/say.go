package service

import (
	"Han/dao"
	"Han/model"
	"Han/utils"
)

// AddSay 添加说说
func AddSay(p *model.ParamSay) int {
	// 把前端参数赋值给 Say对象
	say := model.Say{Content: p.Content}
	// 数据库：添加数据
	if err := dao.AddSay(say); err != nil {
		return utils.CodeError
	}
	return utils.CodeSuccess
}

// DelSay 删除说说
func DelSay(id int) int {
	if err := dao.DelSay(id); err != nil {
		return utils.CodeError
	}
	return utils.CodeSuccess
}

// UpdateSay 更新说说
func UpdateSay(id int, p *model.ParamSay) int {
	// 把前端参数赋值给 Say对象
	say := model.Say{Content: p.Content}
	// 数据库：更新说说
	if err := dao.UpdateSay(id, say); err != nil {
		return utils.CodeError
	}
	return utils.CodeSuccess
}

// GetSay 说说列表
func GetSay(pageSize, pageOffset int) (int, *[]model.Say) {
	// 创建一个容器存放查询到的数据
	says := new([]model.Say)
	// 数据库：查找说说
	if err := dao.GetSay(pageSize, pageOffset, says); err != nil {
		return utils.CodeError, nil
	}
	return utils.CodeSuccess, says
}
