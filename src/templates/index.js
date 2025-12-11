/**
 * 首页模板生成模块 - 极简时间轴风格 (带分页)
 */
import { BLOG_CONFIG } from "../config.js";
import { formatDate } from "../utils/date.js";

const ITEMS_PER_PAGE = 6;

/**
 * 生成内容摘要
 */
function generatePreview(content) {
  if (!content) return "";
  return content
    .replace(/^#+ .*$/gm, "") // 移除标题
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 链接转文本
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // 移除图片
    .replace(/`{1,3}[^`]+`{1,3}/g, "") // 移除代码块
    .replace(/<[^>]+>/g, "") // 移除HTML标签
    .replace(/\n+/g, " ") // 换行转空格
    .trim();
}

/**
 * 生成时间轴项目 HTML
 */
function generateTimelineItem(item) {
  const isPost = item.type === "post";
  // 使用精确到日的时间格式
  const displayTime = formatDate(item.date);

  let contentHtml = "";
  let linkUrl = "";
  let cardClass = "timeline-card";

  if (isPost) {
    // 文章：标题 + 内容预览
    const plainContent = generatePreview(item.content);
    contentHtml = `
      <div class="card-body">
        <span class="timeline-title">${item.title}</span>
        <span class="timeline-content">${plainContent}</span>
      </div>
    `;
    linkUrl = item.url;
    cardClass += " is-post";
  } else {
    // 碎语：纯内容预览
    const plainContent = generatePreview(item.content);
    contentHtml = `<span class="timeline-content">${plainContent}</span>`;
    // 链接到碎语页的具体锚点 (使用时间戳)
    const journalId = `j-${new Date(item.date).getTime()}`;
    linkUrl = `/journals#${journalId}`;
    cardClass += " is-journal";
  }

  return `
    <article class="${cardClass}" onclick="location.href='${linkUrl}'">
      ${contentHtml}
      <span class="time-tag">${displayTime}</span>
    </article>
  `;
}

/**
 * 生成分页导航 HTML
 */
function generatePagination(currentPage, totalPages) {
  if (totalPages <= 1) return "";

  const prevLink =
    currentPage > 1
      ? `<a href="${
          currentPage === 2 ? "/" : `/page/${currentPage - 1}/`
        }" class="page-nav">上一页</a>`
      : '<span class="page-nav disabled">上一页</span>';

  const nextLink =
    currentPage < totalPages
      ? `<a href="/page/${currentPage + 1}/" class="page-nav">下一页</a>`
      : '<span class="page-nav disabled">下一页</span>';

  return `
    <nav class="pagination">
      ${prevLink}
      <span class="page-number">${currentPage} / ${totalPages}</span>
      ${nextLink}
    </nav>
  `;
}

/**
 * 生成单页 HTML
 */
function generatePageHtml(items, currentPage, totalPages) {
  const timelineHtml = items.map((item) => generateTimelineItem(item)).join("");

  const paginationHtml = generatePagination(currentPage, totalPages);

  // 相对路径处理：如果是第1页(根目录)，css路径为 /static/style.css
  // 如果是子页(page/x/)，css路径需要向上两级或使用绝对路径
  // 这里统一使用绝对路径 /static/style.css，依赖服务器配置或构建输出结构

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="description" content="${BLOG_CONFIG.description}"/>
  <link href="/static/style.css" rel="stylesheet"/>
  <title>${BLOG_CONFIG.title}${
    currentPage > 1 ? ` - 第 ${currentPage} 页` : ""
  }</title>
</head>
<body id="top">
  
  <div class="main-container">
    <header class="site-header">
      <h1 class="site-title"><a href="/">涵有闲</a></h1>
      <nav class="simple-nav">
        <a href="/archive">文章</a>
        <a href="/doit">行动</a>
        <a href="/journals">碎语</a>
        <a href="/about#now">现在</a>
        <a href="/about">关于</a>
      </nav>
    </header>

    <main class="timeline-container">
      ${timelineHtml}
    </main>
    
    ${paginationHtml}

    <footer class="site-footer site-footer-center">
      <span>© ${BLOG_CONFIG.yearRange} ${
    BLOG_CONFIG.author
  } · <a href="/feed">订阅</a></span>
    </footer>
  </div>
  
  ${BLOG_CONFIG.analytics}
</body>
</html>`;
}

/**
 * 生成所有分页 HTML
 * @returns {Array} [{ path: string, html: string }]
 */
export function generateIndexPages(posts, journals = []) {
  // 1. 合并所有数据
  const allItems = [
    ...posts.map((p) => ({
      ...p,
      type: "post",
      timestamp: new Date(p.date).getTime(),
    })),
    ...journals.map((j) => ({
      ...j,
      type: "journal",
      timestamp: new Date(j.date).getTime(),
    })),
  ];

  // 2. 排序
  allItems.sort((a, b) => b.timestamp - a.timestamp);

  // 3. 分页
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    const start = (i - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = allItems.slice(start, end);

    const html = generatePageHtml(pageItems, i, totalPages);

    // 第1页输出到 index.html，其他页输出到 page/x/index.html
    const path = i === 1 ? "index.html" : `page/${i}/index.html`;
    pages.push({ path, html });
  }

  // 如果没有内容，至少生成一个空首页
  if (pages.length === 0) {
    pages.push({ path: "index.html", html: generatePageHtml([], 1, 1) });
  }

  return pages;
}
