package dao

import (
	"Han/model"
)

// CountTag 标签总数
func CountTag() int64 {
	var total int64
	db.Model(&model.Tag{}).Count(&total)
	return total
}

// 指定标签下文章个数

// AddTag 添加标签
func AddTag(tag model.Tag) error {
	return db.Create(&tag).Error
}

// DelTag 删除标签
func DelTag(id int) error {
	return db.Delete(&model.Tag{}, id).Error // 内联写法
}

// UpdateTag 更新标签
func UpdateTag(id int, tag model.Tag) error {
	return db.Model(&model.Tag{}).Where("id = ?", id).Update("name", tag.Name).Error
}

// GetTag 标签列表
func GetTag(tag *[]model.Tag) error {
	return db.Find(&tag).Error
}
