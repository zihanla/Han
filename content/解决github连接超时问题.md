---
title: "解决github连接超时问题"
author: "子涵"
slug: "resolve-github-connection-timed-out"
date: 2022-09-11
---

> git clone github 仓库出问题了，记录下解决方案

## 报错信息

```
Failed to connect to github.com port 443: Operation timed out

```

## 解决方案

> 针对科学上网的解决方案

```bash
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

```

Tip: 不同的代理软件端口号不同，clash 默认是 7890；具体情况看代理软件设置，或者找网络和 Internet >代理 > 手动设置代理 里面可以查到(win10、11 其它自行百度)。
