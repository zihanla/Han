/**
 * 首页模板生成模块
 *
 * 作用：生成博客首页的 HTML
 * 包含：
 * 1. 页面基本信息(标题、描述等)
 * 2. 文章列表
 * 3. 导航菜单
 * 4. 页脚信息
 */
import { BLOG_CONFIG } from "../config.js";

/**
 * 生成文章列表 HTML
 * @param {Array} posts - 文章列表数据
 * @returns {string} 文章列表 HTML
 */
function generatePostList(posts) {
  return posts
    .map(
      (post) => `
      <li>
        <a class="post-title" href="${post.url}">${post.title}</a>
        <span class="post-date">${post.displayDate}</span>
      </li>
    `
    )
    .join("");
}

/**
 * 生成首页 HTML
 * @param {Array} posts - 文章列表数据
 * @returns {string} 完整的首页 HTML
 */
export function generateIndexHtml(posts) {
  const postList = generatePostList(posts);

  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"/>
  <meta content="${BLOG_CONFIG.keywords}" name="keywords"/>
  <meta content="${BLOG_CONFIG.description}" name="description"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <link href="/static/style.css" rel="stylesheet"/>
  <title>${BLOG_CONFIG.title}</title>

</head>
<body id="top">
  <a href="#top" class="back-to-top" aria-label="返回顶部">↑</a>
  <header class="site-header">
    <div class="site-title">
      <a href="/">${BLOG_CONFIG.title}</a>
    </div>
    <nav class="site-nav">
      <a href="/about#now">现在</a>
      <a href="/journals">碎语</a>
      <a href="/about">关于</a>
    </nav>
  </header>

  <div class="slogan">
    Keep it simple and focus on what matters
    <br>
    保持简单，专注于重要的事情
  </div>

  <main>
    <ul class="post-list">${postList}</ul>
  </main>

  <footer>
    <span>© ${BLOG_CONFIG.yearRange} ${BLOG_CONFIG.author}</span>
    <a href="/feed">订阅</a>
  </footer>
  ${BLOG_CONFIG.analytics}
</body>
</html>`;
}
