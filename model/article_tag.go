package model

/*
	文章标签关联
*/

type ArticleTag struct {
	ArticleID uint `gorm:"int(10)" json:"article_id"`
	TagID     uint `gorm:"int(10)" json:"tag_id"`
}
