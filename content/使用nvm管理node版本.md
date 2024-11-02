---
title: "使用nvm管理node版本"
author: "子涵"
slug: "use-nvm-manage-node"
date: 2022-12-16
---

> nvm 允许不同版本 node 共存并切换

我主要用于解决拉取的项目，包与 node 版本之间的冲突

### 下载

[nvm-setup](https://github.com/coreybutler/nvm-windows/releases)

### 安装

清空电脑上之前的 node 后，无脑下一步，注意 nvm 和 node 的安装位置，忘记了可以去环境变量里找 NVM_HOME、NVM_SYMLINK

### 设置源

去 nvm 的安装位置找到 settings.txt，在后面添加源

```bash
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/6

```

npm 的源可以用 nrm 管理：[npm 日常笔记](https://hyx.ink/13)

### 使用

```bash
// 查看版本
nvm -v
// 显示可安装的node版本
nvm list available
// 安装指定版本node
nvm install 版本号
// 卸载指定版本的node
nvm uninstall 版本号
// 切换指定版本node
mvm use 版本号

```
