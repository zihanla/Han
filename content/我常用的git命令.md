---
title: "我常用的git命令"
author: "子涵"
slug: "git-common-commands"
date: 2022-10-06
---

> 以前没提交代码到仓库的觉悟，现在尝试把 git 和 github 加入到我的日常，一下是我常用的 git 命令。

IDE 提供了很好的 git 图形化操作，基本不用写命令，就记录几个用的多的。

```
git branch -M main // github创建仓库默认主分支为main IDE默认master 重命名分支为main

git remote add origin 远程仓库地址  // 本地仓库与指定仓库建立联系

git log --pretty=oneline  // 查看所有历史版本信息(版本、描述)

git reset --hard   + 指定版本号 // 回滚到 指定版本

```

IDE 还没玩儿明白，大概之后这些命令也不用记了。(emmm 刚刚安装了中文插件，发现了新大陆 IDE 太强大了)

> 2023.5.28 更新

本地仓库想要跟远程仓库关联，首先创建远程仓库，然后再 IDE 点击推送，输入远程仓库地址就可以自动关联了

> 2023.8.1 更新

本地仓库直接提交，通过 ide 可以自动在远程仓库进行创建，不用先去远程创建，再关联
