/**
 * RSS feed 生成模块
 *
 * 作用：生成符合 RSS 2.0 标准的订阅源
 *
 * 注意：使用手写 XML 以支持 dc:creator 标签
 */
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
 * XML 转义函数
 * @param {string} str - 需要转义的字符串
 * @returns {string} 转义后的字符串
 */
function escapeXml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * 转换日期为 RFC 822 格式
 * @param {Date} date - 日期对象
 * @returns {string} RFC 822 格式的日期字符串
 */
function toRFC822(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = days[date.getDay()];
  const dateNum = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // 获取时区偏移
  const offset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60)
    .toString()
    .padStart(2, "0");
  const offsetMinutes = (Math.abs(offset) % 60).toString().padStart(2, "0");
  const timezone = `${offset >= 0 ? "+" : "-"}${offsetHours}${offsetMinutes}`;

  return `${day}, ${dateNum} ${month} ${year} ${hours}:${minutes}:${seconds} ${timezone}`;
}

/**
 * 生成 RSS feed
 * @param {Array} posts - 文章列表
 * @returns {string} RSS XML 字符串
 */
export async function generateFeed(posts) {
  const now = new Date();
  const lastBuildDate = toRFC822(now);

  // 构建 RSS 头部
  let rss = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
    <channel>
        <title>${escapeXml(BLOG_CONFIG.title)}</title>
        <link>${BLOG_URL}</link>
        <description>${escapeXml(BLOG_CONFIG.description)}</description>
        <lastBuildDate>${lastBuildDate}</lastBuildDate>
        <docs>https://validator.w3.org/feed/docs/rss2.html</docs>
        <generator>Han Static Blog Generator</generator>
        <language>zh-CN</language>
        <atom:link href="${BLOG_URL}/feed" rel="self" type="application/rss+xml"/>
`;

  // 添加每篇文章
  posts.forEach((post) => {
    const date = parseDate(post.date);
    const pubDate = toRFC822(date);

    rss += `        <item>
            <title><![CDATA[${post.title}]]></title>
            <link>${BLOG_URL}${post.url}</link>
            <guid>${BLOG_URL}${post.url}</guid>
            <pubDate>${pubDate}</pubDate>
            <dc:creator>${escapeXml(post.author)}</dc:creator>
            <description><![CDATA[${post.description}]]></description>
        </item>
`;
  });

  // 关闭标签
  rss += `    </channel>
</rss>`;

  return rss;
}
