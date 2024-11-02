---
title: "npm日常笔记"
author: "子涵"
slug: "npm-notes"
date: 2022-10-15
---

### npm 配置镜像源

```bash
// 配置npm全局源
npm config set registry registry.npmmirror.com
// 查看npm源地址
npm config get registry

```

### 使用 nrm 管理 npm 镜像源(推荐)

> nrm 只修改的是源地址，仍使用 npm 的方式管理包

```bash
// 全局安装
npm i nrm -g
// 查看版本号
nrm -V
// 查看所有源
nrm list
// 换源
nrm use 源名称
// 添加
nrm add 源名称 源地址
// 删除
nrm del 源名称
// 测试指定源响应速度
nrm test 源名称

```

### npm 基本使用

```bash
// 初始化项目包管理(package.json)
npm inint -y
// 当在package中修改依赖版本后需要下载
npm install
// 忽略模块相同，版本不同，继续安装
--legacy-peer-deps
//例如：
npm i cz-customizable@6.3.0 --save-dev --legacy-peer-deps

```
