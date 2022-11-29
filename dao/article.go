package dao

import (
	"Han/model"

	"gorm.io/gorm"
)

// AddArt 添加文章
func AddArt(article model.Article) error {
	err := db.Create(&article).Error
	return err
}

// DelArt 删除文章
func DelArt(id int) error {
	// 清除指定文章与标签之间的引用
	db.Model(&model.Article{Model: gorm.Model{ID: uint(id)}}).Association("Tag").Clear()
	// 删除文章
	return db.Delete(&model.Article{}, id).Error
}

// UpdateArt 更新文章
func UpdateArt(id int, article model.Article) error {
	// 长度不为0 说明有标签需要修改
	if len(article.Tag) != 0 {
		// 清除指定文章与标签之间的引用
		db.Model(&model.Article{Model: gorm.Model{ID: uint(id)}}).Association("Tag").Clear()
		// 给指定文章添加指定标签
		db.Model(&model.Article{Model: gorm.Model{ID: uint(id)}}).Association("Tag").Append(&article.Tag)
	}
	// 修改文章 Omit("Tag") 修改时忽略Tag字段
	return db.Model(&model.Article{}).Where("id = ?", id).Omit("Tag").Updates(&article).Error
}

// GetArt 文章列表
func GetArt(pageSize, pageOffset int, total *int64, articles *[]model.Article) error {
	// Preload 预加载 同时加载指定表信息
	err := db.Preload("Tag").Select("id,created_at,updated_at,title,`desc`,img").Limit(pageSize).Offset((pageOffset - 1) * pageSize).Order("created_at DESC").Find(articles).Error
	// 计算文章数量
	db.Model(articles).Count(total)
	return err
}

// GetArtInfo 根据ID查文章
func GetArtInfo(id int, article *model.Article) error {
	return db.Preload("Tag").First(article, "id = ?", id).Error
}

//// GetTagArt 指定标签下的所有文章
//func GetTagArt(id, pageSize, pageOffset int, total *int64, articles *[]model.Article) error {
//	// Preload 预加载 同时加载指定表信息
//	err := db.Preload("Tag").Select("id,created_at,updated_at,title,`desc`,img").Limit(pageSize).Offset((pageOffset-1)*pageSize).Order("created_at DESC").Find(articles).Error
//	// 查找标签的同时加载文章
//	db.Model(articles).Count(total)
//	return err
//}
