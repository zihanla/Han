package model

/*
	标签
*/

type Tag struct {
	ID      uint   `json:"id"`                                       // 标签ID
	TagName string `gorm:"type:varchar(20);not null" json:"tagname"` // 标签名
}
