/**
 * 生成博客的 RSS feed
 * 可以让用户订阅博客,在阅读器中接收更新
 */
import { Feed } from "feed";
import { BLOG_CONFIG, BLOG_URL } from "../config.js";

// 转换为中国时区的时间
function toChineseTime(date) {
  const utcDate = new Date(date.getTime() + (8 * 60 * 60 * 1000)); // 加8小时
  return utcDate;
}

export async function generateFeed(posts) {
  const feed = new Feed({
    title: BLOG_CONFIG.title,
    description: BLOG_CONFIG.description,
    id: BLOG_URL,
    link: BLOG_URL,
    language: "zh-CN",
    updated: toChineseTime(new Date()),
    feedLinks: {
      rss: `${BLOG_URL}/feed`
    },
    author: {
      name: BLOG_CONFIG.author,
    },
  });

  // 遍历所有文章,将每篇文章添加到 feed 中
  posts.forEach((post) => {
    let date;
    if (typeof post.date === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(post.date)) {
        // 纯日期格式，使用北京时间 08:00:00
        date = new Date(`${post.date}T08:00:00+08:00`);
      } else if (post.date.includes(':')) {
        // 带时间的格式，添加时区信息
        date = new Date(`${post.date.replace(' ', 'T')}:00+08:00`);
      }
    } else {
      date = new Date(post.date);
    }
    
    feed.addItem({
      title: post.title,
      id: `${BLOG_URL}${post.url}`,
      link: `${BLOG_URL}${post.url}`,
      description: post.description,
      date: toChineseTime(date)  // 转换为中国时区
    });
  });

  return feed.rss2();
}
