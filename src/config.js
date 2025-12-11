// ============================================================
// 博客配置
// ============================================================

export const BLOG_URL = "https://hyx.ink";

// 计算年份范围
const startYear = 2021;
const currentYear = new Date().getFullYear();
const yearRange = `${startYear}-${currentYear}`;

export const BLOG_CONFIG = {
  title: "涵有闲",
  author: "子涵",
  description:
    "动起来就好，想做就去做吧。涵有闲博客，记录生活点滴，分享生活感悟。",
  language: "zh-CN",
  keywords: "blog, 涵有闲, Han, 碎片生活, note, 个人博客, 生活记录",
  email: "im.zihanla@gmail.com",
  yearRange,
  analytics: `
    <!-- 百度统计 -->
    <script>
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?dd3de863d99a084d9ebd540d0bb7724b";
      hm.async = true;
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
    </script>
  `,
};

// ============================================================
// 路径配置 - 集中管理所有文件路径
// ============================================================

export const PATHS = {
  // 内容目录
  content: "./content",
  about: "./about.md",
  journals: "./journals.json",
  journalsMd: "./journals.md",
  doit: "./doit.json",

  // 输出目录
  dist: "./dist",
  distPost: "./dist/post",
  distStatic: "./dist/static",
  distIndex: "./dist/index.html",
  distAbout: "./dist/about.html",
  distJournals: "./dist/journals.html",
  distDoit: "./dist/doit.html",
  distFeed: "./dist/feed",

  // 模板文件
  templatePage: "./src/templates/page.html",
  templateStyle: "./src/templates/style.css",
  templateJournals: "./src/templates/journals.html",
  templateDoit: "./src/templates/doit.html",

  // 构建缓存
  buildHash: "./.build-hash.json",
};

export const HASH_FILE = PATHS.buildHash;
