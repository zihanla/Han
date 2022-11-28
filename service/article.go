package service

import (
	"Han/dao"
	"Han/model"
	"Han/utils"
)

// AddArt 添加文章
func AddArt(p *model.ParamArticle) int {
	// 把请求参数 赋值给Article
	article := model.Article{
		Title:   p.Title,
		Desc:    p.Desc,
		Content: p.Content,
		Img:     p.Img,
	}
	if len(p.Tag) != 0 {
		var tags []model.Tag
		// 索引k 值v
		for _, id := range p.Tag {
			//fmt.Println("service range:", id)
			tags = append(tags, model.Tag{ID: id})
		}
		//fmt.Println("tags:", tags)
		article.Tag = tags
	}
	// 数据库：添加数据
	if err := dao.AddArt(article); err != nil {
		return utils.CodeError
	}
	// 返回状态码
	return utils.CodeSuccess
}

// DelArt 删除文章
func DelArt(id int) int {
	if err := dao.DelArt(id); err != nil {
		return utils.CodeError
	}
	return utils.CodeSuccess
}

// UpdateArt 更新文章
func UpdateArt(id int, p *model.ParamArticle) int {
	// 把请求参数 赋值给Article
	article := model.Article{
		Title:   p.Title,
		Desc:    p.Desc,
		Content: p.Content,
		Img:     p.Img,
	}
	if len(p.Tag) != 0 {
		var tags []model.Tag
		// 索引k 值v
		for _, id := range p.Tag {
			tags = append(tags, model.Tag{ID: id})
		}
		article.Tag = tags
	}
	// 数据库：修改数据
	if err := dao.UpdateArt(id, article); err != nil {
		return utils.CodeError
	}
	// 返回状态码
	return utils.CodeSuccess
}

// GetArt 文章列表
func GetArt(pageSize, pageOffset int) (int, *[]model.Article, *int64) {
	// 创建一个容器装查到的数据
	articles := new([]model.Article)
	total := new(int64)
	// 数据库：获取列表
	if err := dao.GetArt(pageSize, pageOffset, total, articles); err != nil {
		return utils.CodeError, nil, nil
	}
	return utils.CodeSuccess, articles, total
}

// GetArtInfo 根据ID查文章
func GetArtInfo(id int) (int, *model.Article) {
	article := new(model.Article)
	if err := dao.GetArtInfo(id, article); err != nil {
		return utils.CodeError, nil
	}
	return utils.CodeSuccess, article
}

// GetTagArt 指定标签下的所有文章
func GetTagArt() {
}
