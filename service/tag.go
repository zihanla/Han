package service

import (
	"Han/dao"
	"Han/model"
	"Han/utils"
)

// AddTag 添加标签
func AddTag(p *model.ParamTag) int {
	// 把标签请求参数 赋值给Tag对象
	tag := model.Tag{Name: p.Name}
	// 数据库：新增标签
	if err := dao.AddTag(tag); err != nil {
		return utils.CodeTagUsed
	}
	return utils.CodeSuccess
}

// DelTag 删除标签
func DelTag(id int) int {
	if err := dao.DelTag(id); err != nil {
		return utils.CodeError
	}
	return utils.CodeSuccess
}

// UpdateTag 更新标签
func UpdateTag(id int, p *model.ParamTag) int {
	// 把标签请求参数 赋值给Tag对象
	tag := model.Tag{Name: p.Name}
	// 数据库：更新标签
	if err := dao.UpdateTag(id, tag); err != nil {
		return utils.CodeError
	}
	return utils.CodeSuccess
}

// GetTag 标签列表
func GetTag() (int, *[]model.Tag) {
	// 创建一个tags切片指针容器 方便拿到值
	tags := new([]model.Tag)
	// 数据库：给标签列表赋值，返回错误信息
	if err := dao.GetTag(tags); err != nil {
		return utils.CodeError, nil
	}
	return utils.CodeSuccess, tags
}
