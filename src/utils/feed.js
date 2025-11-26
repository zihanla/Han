/**
 * RSS feed 生成模块
 *
 * 作用：生成符合 RSS 2.0 标准的订阅源
 *
 * 注意：RSS 日期使用 ISO 8601 格式，RSS 阅读器会自动处理时区
 */
import { Feed } from "feed";
import { BLOG_CONFIG, BLOG_URL } from "../config.js";

/**
 * 解析文章日期字符串为 Date 对象
 * 支持格式：
 * - "2024-11-26" → 2024-11-26 00:00:00 (北京时间)
 * - "2024-11-26 14:30" → 2024-11-26 14:30:00 (北京时间)
 *
 * @param {string|Date} dateStr - 日期字符串或 Date 对象
 * @returns {Date} Date 对象
 */
function parseDate(dateStr) {
  if (dateStr instanceof Date) {
    return dateStr;
  }

  if (typeof dateStr === "string") {
    // "2024-11-26" 格式 - 使用北京时间 00:00:00
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return new Date(`${dateStr}T00:00:00+08:00`);
    }

    // "2024-11-26 14:30" 格式 - 使用北京时间
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dateStr)) {
      return new Date(`${dateStr.replace(" ", "T")}:00+08:00`);
    }
  }

  // 其他格式，尝试直接转换
  return new Date(dateStr);
}

/**
 * 生成 RSS feed
 * @param {Array} posts - 文章列表
 * @returns {string} RSS XML 字符串
 */
export async function generateFeed(posts) {
  const feed = new Feed({
    title: BLOG_CONFIG.title,
    description: BLOG_CONFIG.description,
    id: BLOG_URL,
    link: BLOG_URL,
    language: "zh-CN",
    updated: new Date(), // feed 库会自动处理时区
    feedLinks: {
      rss: `${BLOG_URL}/feed`,
    },
    author: {
      name: BLOG_CONFIG.author,
    },
  });

  // 添加文章到 feed
  posts.forEach((post) => {
    const date = parseDate(post.date);

    feed.addItem({
      title: post.title,
      id: `${BLOG_URL}${post.url}`,
      link: `${BLOG_URL}${post.url}`,
      description: post.description,
      date: date, // feed 库会自动转换为 RFC 822 格式
      author: [{ name: post.author, email: BLOG_CONFIG.email }],
    });
  });

  return feed.rss2();
}
