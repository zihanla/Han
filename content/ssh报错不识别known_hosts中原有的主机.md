---
title: "ssh报错不识别known_hosts中原有的主机"
author: "子涵"
slug: "known-hosts-debug"
date: 2022-09-11
---

> 提交代码到 github，出现 ssh 报错，无法识别主机

## 报错信息

```
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
Please contact your system administrator.
Add correct host key in /root/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /root/.ssh/known_hosts:12
ECDSA host key for xxx has changed and you have requested strict checking.
Host key verification failed.

```

## 解决方案

> 根据提示 /root/.ssh/known_hosts to get rid of this message

删除 /root/.ssh/ 下的 known_hosts 文件

Tips: 删除后本地仓库无法找到远程仓库，需要重新从远程仓库拉取一下
