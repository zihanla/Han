/**
 * 归档页面模板生成模块
 */
import { BLOG_CONFIG } from "../config.js";

/**
 * 生成归档列表 HTML
 * @param {Array} posts - 所有文章列表数据
 * @returns {string} 归档列表 HTML
 */
function generateArchiveList(posts) {
  return posts
    .map(
      (post) => `
    <article class="timeline-card" onclick="location.href='${post.url}'">
      <div class="card-content">
        <h2 class="timeline-title">${post.title}</h2>
      </div>
      <div class="card-meta">
        <span class="time-tag">${post.displayDate}</span>
      </div>
    </article>
  `
    )
    .join("");
}

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
      <span>© ${BLOG_CONFIG.yearRange} ${BLOG_CONFIG.author}</span>
      <span style="margin: 0 0.5rem">·</span>
      <a href="/feed">订阅</a>
    </footer>
  </div>

  ${BLOG_CONFIG.analytics}
</body>
</html>`;
}
