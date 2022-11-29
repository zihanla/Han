package dao

import (
	"Han/model"
)

// AddSay 添加说说
func AddSay(say model.Say) error {
	return db.Create(&say).Error
}

// DelSay 删除说说
func DelSay(id int) error {
	return db.Delete(&model.Say{}, id).Error
}

// UpdateSay 更新说说
func UpdateSay(id int, say model.Say) error {
	return db.Model(&model.Say{}).Where("id = ?", id).Update("content", say.Content).Error
}

// GetSay 说说列表
func GetSay(pageSize, pageOffset int, say *[]model.Say) error {
	return db.Select("id,created_at,`content`").Limit(pageSize).Offset((pageOffset - 1) * pageSize).Order("created_at DESC").Find(say).Error
}

// SayCount 说说总数
func SayCount() int64 {
	var total int64
	db.Model(&model.Say{}).Count(&total)
	return total

}
