package model

/*
	标签
*/

type Tag struct {
	ID   uint   `gorm:"int(10)" json:"id"`                      // 标签ID
	Name string `gorm:"type:varchar(100);not null" json:"name"` // 标签名
}
