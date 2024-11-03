import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { BLOG_CONFIG } from "../config.js";
import { generateSlug } from "./slug.js";
import { formatDate } from "./date.js";

// 1. 添加结果缓存
const postCache = new Map();
const rendererCache = new Map();

// 2. 优化代码高亮初始化
let hljs = null;
let highlightInitPromise = null;

async function initializeHighlight() {
  if (!highlightInitPromise) {
    highlightInitPromise = (async () => {
      try {
        const highlightjs = await import("highlight.js/lib/common");
        hljs = highlightjs;
        return hljs;
      } catch (error) {
        highlightInitPromise = null;
        throw error;
      }
    })();
  }
  return highlightInitPromise;
}

// 3. 优化渲染器创建
function createRenderer(hasCodeBlock = false) {
  const cacheKey = `renderer_${hasCodeBlock}`;
  if (rendererCache.has(cacheKey)) {
    return rendererCache.get(cacheKey);
  }

  const renderer = new marked.Renderer();

  renderer.link = (href, title, text) => {
    // 处理新版本 marked 的对象格式
    if (typeof href === 'object') {
      const linkData = href;
      return `<a target="_blank" rel="noopener noreferrer" href="${linkData.href}">${linkData.text}</a>`;
    }
    
    // 处理旧版本格式（虽然看起来现在不会走到这个分支）
    const url = href || '';
    const content = text || '';
    return `<a target="_blank" rel="noopener noreferrer" href="${url}">${content}</a>`;
  };

  if (hasCodeBlock) {
    renderer.code = function (code, language) {
      try {
        // 处理代码块内容
        let codeText;
        let lang;

        if (typeof code === "object" && code !== null) {
          codeText = code.text || ""; // 使用 text 字段作为代码内容
          lang = code.lang || language; // 优先使用对象中的 lang
        } else {
          codeText = String(code || "");
          lang = language;
        }

        // 如果代码块为空，返回空的高亮块
        if (!codeText.trim()) {
          return '<pre><code class="hljs"></code></pre>';
        }

        // 使用指定的语言进行高亮
        const result =
          lang && hljs
            ? hljs.default.highlight(codeText, { language: lang })
            : hljs.default.highlightAuto(codeText);

        return `<pre><code class="hljs language-${lang || result.language}">${
          result.value
        }</code></pre>`;
      } catch (err) {
        console.error("代码高亮失败:", err);
        // 发生错误时返回转义后的原始代码
        const escapedCode = typeof code === "object" ? code.text : String(code);
        return `<pre><code class="hljs">${escapedCode}</code></pre>`;
      }
    };
  }

  rendererCache.set(cacheKey, renderer);
  return renderer;
}

// 4. 优化元数据处理
async function ensureFileMeta(filePath, content) {
  const { data = {}, content: markdown } = matter(content);
  const updates = {};
  const fileName = path.basename(filePath);

  if (!data.title) updates.title = path.basename(filePath, ".md");
  if (!data.author) updates.author = BLOG_CONFIG.author;
  if (!data.slug) updates.slug = generateSlug(data.title || updates.title);

  if (!data.date) {
    try {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      updates.date = `${formatDate(now)} ${timeStr}`;
    } catch {
      updates.date = formatDate(new Date());
    }
  }

  // 生成描述（优先使用 frontmatter 中的 description）
  const description = data.description || generateExcerpt(markdown);

  const hasUpdates = Object.keys(updates).length > 0;
  const finalData = { ...data, ...updates };

  if (hasUpdates) {
    await fs.writeFile(filePath, matter.stringify(markdown, finalData));
  }

  // 不要对已有日期再次格式化
  const dateStr = finalData.date;

  return {
    meta: {
      title: finalData.title,
      author: finalData.author,
      slug: finalData.slug,
      date: dateStr,
      displayDate: formatDate(dateStr, "display"),
      detailDate: formatDate(dateStr, "detail"),
      // 如果是about.md，则使用根路径URL
      url: fileName === "about.md" ? "/about" : `/post/${finalData.slug}`,
      description: description,
    },
    content: markdown,
  };
}

// 5. 优化图片处理
function processImages(html) {
  return html.replace(/<p>(<img[^>]+>)<\/p>/g, (match, img) => {
    const alt = img.match(/alt="([^"]*)"/);

    // 添加懒加载属性到 img 标签
    const lazyImg = img.replace(/<img/, '<img loading="lazy" decoding="async"');

    return alt?.[1]
      ? `<figure class="image-container">
           ${lazyImg}
           <figcaption>${alt[1]}</figcaption>
         </figure>`
      : `<figure class="image-container">
           ${lazyImg}
         </figure>`;
  });
}

// 6. 优化基本信息获取
export async function getPostBasicInfo(filePath) {
  // 检查缓存
  if (postCache.has(filePath)) {
    return postCache.get(filePath);
  }

  const content = await fs.readFile(filePath, "utf-8");
  const { meta } = await ensureFileMeta(filePath, content);

  // 缓存结果
  postCache.set(filePath, meta);
  return meta;
}

// 7. 优化主处理函数
export async function processMarkdownFile(filePath, template) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const { meta, content: markdown } = await ensureFileMeta(filePath, content);

    if (!markdown) {
      throw new Error(`文件 ${filePath} 内容为空`);
    }

    // 检查是否需要代码高亮
    const hasCodeBlock = markdown.includes("```");
    if (hasCodeBlock) {
      await initializeHighlight();
    }

    // 配置 marked
    const markedOptions = {
      renderer: createRenderer(hasCodeBlock),
      gfm: true,
      breaks: true,
      headerIds: false,
      mangle: false,
      smartLists: true,
    };

    // 生成 HTML
    let html = marked(markdown, markedOptions);
    html = processImages(html);

    // 应用模板
    const processedHtml = template
      .replace(/\$title\$/g, meta.title)
      .replace(/\$author\$/g, meta.author)
      .replace(/\$date\$/g, meta.detailDate)
      .replace(/\$description\$/g, meta.description) // 使用文章描述
      .replace(/\$keywords\$/g, BLOG_CONFIG.keywords)
      .replace(
        "$highlight$",
        hasCodeBlock
          ? '<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/highlight.js/11.9.0/styles/github.min.css">'
          : ""
      )
      .replace(/\$yearRange\$/g, BLOG_CONFIG.yearRange)
      .replace(/\$blog_title\$/g, BLOG_CONFIG.title) // 博客标题
      .replace("$analytics$", BLOG_CONFIG.analytics) // 百度统计 $analytics$
      .replace("$body$", html);

    return {
      ...meta,
      content: markdown,
      html: processedHtml,
    };
  } catch (error) {
    console.error(`处理文件 ${filePath} 失败:`, error);
    throw error;
  }
}

// 添加新的函数用于生成文章摘要
function generateExcerpt(markdown, maxLength = 120) {
  try {
    // 移除 Markdown 中的标记和多余空白
    const plainText = markdown
      .replace(/^#+ .*$/gm, "") // 移除标题
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 将链接转换为纯文本
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // 移除图片
      .replace(/`{1,3}[^`]+`{1,3}/g, "") // 移除代码块
      .replace(/\n\s*\n/g, " ") // 将多个空行转换为单个空格
      .replace(/\s+/g, " ") // 将所有连续的空白字符(包括换行)转换为单个空格
      .trim();

    // 截取指定长度
    if (plainText.length <= maxLength) {
      return plainText;
    }

    // 智能截取，避免在单词中间截断
    let excerpt = plainText.slice(0, maxLength);
    const lastSpace = excerpt.lastIndexOf(" ");

    if (lastSpace > maxLength * 0.8) {
      // 如果最后一个空格在合理位置
      excerpt = excerpt.slice(0, lastSpace);
    }

    return excerpt + "...";
  } catch (error) {
    console.warn("生成摘要失败:", error);
    return "";
  }
}
