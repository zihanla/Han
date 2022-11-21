package model

/*
	文章标签关联
*/

type TagMapArticle struct {
	ArticleID uint `gorm:"not null" json:"article_id"`
	TagID     uint `gorm:"not null" json:"tag_id"`
}
