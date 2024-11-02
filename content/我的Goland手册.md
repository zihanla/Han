---
title: "我的Goland手册"
author: "子涵"
slug: "golang-manual"
date: 2022-10-12
---

> 看用推荐 goland 的插件和配置的文章很少，索性分享下常用的

## 常用插件

- Xcode-Dark Theme 看起来很舒服的主题
- Chinese Language Pack 中文插件，又爱又恨，但不得不说是它教会我用一些 IDE 的一些功能
- Rainbow Brackets 彩色括号，哼多层嵌套，不会把我绕晕了
- GitToolBox git 的辅助工具，可以清晰的看到每行的提交信息(暂时没用了 列选择模式的时候 没有适配好)
- .ignore git 辅助工具，使用后右键可以添加不需要上传的文件(ide 自带有了)

## 快捷键

格式化代码 ctrl + alt + L
替换文本 ctrl + R
查找文本 ctrl + F
删除光标所在行 ctrl + X
复制光标所在行 ctrl + D
递归折叠、展开 ctrl + shift -、+
win 按住鼠标中间键可以同时选择多个光标

## 配置

常用的忽略后缀

```go
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
.idea
*.xml

```

字体字号配置

操作界面是默认的 YaHei , 字号 13

编辑器是默认字体，大小 16.0，行高 1.2

配合 Xcode-Dark Theme 真的舒服
