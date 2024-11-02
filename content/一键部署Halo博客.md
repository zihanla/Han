---
title: "一键部署Halo博客"
author: "子涵"
slug: "deploy-Halo-blog"
date: 2022-06-29
---

## 前言

- 2023.4.11 使用 notion + nobelium + vercel 的形式部署博客
- 2022.12.30 halo 博客 2.0 时代了，不大喜欢了，转回 typecho,目前教程仅对 halo1.5 及以下生效。

> 本文的目的是，让大家可以专注于写作本身；至于如何搭建，大道至简，全程跟着我的节奏，无脑 CV 即可，不要纠结过程。

## 安装

### 利其器

- 环境 Centos7.6
- 服务器管理工具 [FinalShell](http://www.hostbuf.com/t/988.html)
- 写作工具 [Typora](https://www.aliyundrive.com/drive/folder/6247c8ccaff7826206044d95874b4a6e0b666d53)
- 升级商店、安装下载工具

```bash
# 升级yum管理包(升级应用商店 腾讯云等地方买的升级不是不必要)
yum update
# 安装wget
yum install -y wget

```

视频教程 [一键部署个人博客，专注写作本身](https://www.bilibili.com/video/BV1NU4y1X7ai)

### 安装宝塔

> 7 系列的宝塔安装是需要登录的，这里借助 彩虹脚本 进行优化 （有需要输入 y 的地方一路 y 下去）

```bash
# 安装宝塔
wget -O install.sh http://f.cccyun.cc/bt/install_6.0.sh && bash install.sh
# 降级到7.7
curl http://f.cccyun.cc/bt/update6.sh|bash
# 优化脚本
wget -O optimize.sh http://f.cccyun.cc/bt/optimize.sh && bash optimize.sh

```

### 安装 Docker 容器

> 参考 菜鸟笔记 （有需要输入 y 的地方一路 y 下去）

```bash
# 使用官方脚本自动安装Docker
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
# 启动Docker
sudo systemctl start docker
# 测试是否安装成功
 sudo docker run hello-world

```

### 使用 Docker 部署 Halo

Halo 官方文档 [使用 Docker 部署 Halo](https://docs.halo.run/getting-started/install/docker) 超级详细，我们直接跟着官方的来就行了

### 反向代理

> 登录宝塔，推荐安装 LNMP 时，只需选择安装 Nginx；安装完成后点击网站建一个站点,配置对应域名的 SSL 证书,并强制开启 https；然后在配置文件添加反代脚本即可。

```
  # 需要注释掉的地方(大概在40多行): Ctrl + / 选中当前内容一键注释
  # location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
  # {
  #     expires      30d;
  #     error_log /dev/null;
  #     access_log /dev/null;
  # }

  # location ~ .*\.(js|css)?$
  # {
  #     expires      12h;
  #     error_log /dev/null;
  #     access_log /dev/null;
  # }

  # 反代脚本:
     location / {
  proxy_pass http://127.0.0.1:8090/;
  rewrite ^/(.*)$ /$1 break;
  proxy_redirect off;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header Upgrade-Insecure-Requests 1;
  proxy_set_header X-Forwarded-Proto https;
}

```

### 主题推荐

> 位置不分前后，推荐的主题都是有在更新的，基本都用过，主题仓库的可以不用看了

- 简洁风格
  - [daisy](https://github.com/liaocp666/halo-theme-daisy)
  - [Xue](https://halo.run/archives/theme-xue.html)
  - [若至随笔](https://rz.sbl/) 还没发出来不过超
  - [hingle](https://github.com/Pedro-null/halo-theme-hingle)
  - [MaterialYour](https://halo.run/archives/materialyour.html)
  - [anatole](https://github.com/halo-dev/halo-theme-anatole)
  - [彼岸](https://github.com/guqing/halo-theme-higan)
  - [vCards](https://github.com/iRoZhi/Halo-vCards-theme)
  - [Butterfly](https://halo.run/archives/butterfly.html)
- 功能型
  - [Dream](https://halo.run/archives/dream.html)功能超级多，关闭了大量功能后，称得上简洁
  - [Joe](https://halo.run/archives/joe20.html)
  - [Sakura](https://halo.run/archives/theme-sakura.html)
  - [新逸 Cary](https://blog.xinac.cn/)

## 结束语

大道至简，愿大家不要因为乱七八糟的东西，忘记了本来的目的，就像写作。
