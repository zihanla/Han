---
title: "使用TailWind CSS新建项目"
author: "子涵"
slug: "use-tailwind"
date: 2022-09-24
---

> 使用 TailWind CSS，新建项目

## 安装 Tailwind CSS

tailwindcss 通过 npm 安装，并创建您的 tailwind.config.js 文件

```bash
npm install -D tailwindcss
npx tailwindcss init

```

## 配置模板路径

用以下配置覆盖 tailwind.config.js 文件中的配置(实现 src 下的 html、js 文件自动识别)

```
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

## 引入 Tailwind 样式定义 到 CSS 文件中

创建一个 css 文件，位置、名称随意，比如 src/main.css,并且写入以下内容：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 在 HTML 中使用 Tailwind

将已编译的 CSS 文件添加到 <head> ,就可以使用 Tailwind 来设置内容样式了。

```html
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/dist/output.css" rel="stylesheet" />
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
  </body>
</html>
```

使用以下命令进行编译

```
npm init -y

```

## 添加实时编译

在 package.json 文件 scripts 段，代码块中中引入以下内容

```
"build": "tailwindcss -i ./src/main.css -o ./dist/output.css --watch"

```

运行 npm run build ，实现自动监听页面改动，实时编译

## 声明

原创：[乌鸦嘴](https://wyz.xyz/d/306-tailwind-30tailwind-css/3)
