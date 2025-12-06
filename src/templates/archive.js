/**
 * 归档页面模板生成模块
 */
import { BLOG_CONFIG } from "../config.js";

export function generateArchiveHtml(posts) {
  // 生成文章列表（简单列表形式，放在一个卡片内）
  const archiveList = posts
    .map(
      (post) => `
      <div class="archive-item">
        <a href="${post.url}">${post.title}</a>
        <span class="archive-date">${post.displayDate}</span>
      </div>
    `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="description" content="文章归档 - ${BLOG_CONFIG.title}"/>
  <link href="/static/style.css" rel="stylesheet"/>
  <title>文章归档 - ${BLOG_CONFIG.title}</title>
</head>
<body id="top">
  
  <div class="main-container">
    <header class="site-header with-border">
      <h1 class="site-title">文章归档</h1>
      <nav class="simple-nav">
        <a href="/">首页</a>
        <a href="/journals">碎语</a>
        <a href="/about#now">现在</a>
        <a href="/about">关于</a>
      </nav>
    </header>

    <main>
      <div class="archive-list">
          ${archiveList}
        </div>
    </main>

    <footer class="site-footer">
      <a href="#top" class="back-to-top">返回顶部 ↑</a>
      <span>© ${BLOG_CONFIG.yearRange} ${BLOG_CONFIG.author} · <a href="/feed">订阅</a></span>
    </footer>
  </div>

  ${BLOG_CONFIG.analytics}
</body>
</html>`;
}
