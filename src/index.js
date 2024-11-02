import fs from "fs/promises";
import path from "path";
import CleanCSS from "clean-css";
import { minify } from "terser";
import { calculateHash, readBuildHash, saveBuildHash } from "./utils/hash.js";
import { processMarkdownFile, getPostBasicInfo } from "./utils/post.js";
import { generateFeed } from "./utils/feed.js";
import { generateIndexHtml } from "./templates/index.js";
import { processJournals, generateJournalsHtml } from "./utils/journals.js";

// 清理旧文件
async function cleanupOldFiles(existingHtmlFiles, outputDir) {
  for (const slug of existingHtmlFiles) {
    try {
      const filePath = path.join(outputDir, `${slug}.html`);
      await fs.unlink(filePath);
      console.log(`删除文件: post/${slug}.html...`);
    } catch (error) {
      console.warn(`删除文件失败 ${slug}.html:`, error);
    }
  }
}

// 压缩CSS文件
async function minifyCSS(content) {
  const cleanCSS = new CleanCSS({
    level: 2, // 使用更激进的压缩
  });
  return cleanCSS.minify(content).styles;
}

// 压缩JS文件
async function minifyJS(content) {
  const result = await minify(content, {
    compress: true,
    mangle: true,
  });
  return result.code;
}

// 复制并压缩文件
async function copyAndMinifyFile(sourceFile, targetFile) {
  const content = await fs.readFile(sourceFile, "utf-8");
  let minified;

  if (sourceFile.endsWith(".css")) {
    minified = await minifyCSS(content);
  } else if (sourceFile.endsWith(".js")) {
    minified = await minifyJS(content);
  } else {
    // 非CSS/JS文件直接复制
    await fs.copyFile(sourceFile, targetFile);
    return;
  }

  await fs.writeFile(targetFile, minified);
}

// 创建目录结构
async function createDirectories() {
  const dirs = ["./dist", "./dist/post", "./dist/static"];
  await Promise.all(dirs.map((dir) => fs.mkdir(dir, { recursive: true })));
}

// 检查模板文件变化
async function checkTemplateChanges(buildHashes = {}) {
  const newHashes = {};
  // 将模板文件分组
  const commonTemplates = [
    "./src/templates/page.html", // 文章模板
    "./src/templates/index.js", // 首页模板
    "./src/templates/style.css", // 样式文件
  ];

  const journalTemplate = "./src/templates/journals.html"; // 碎语模板单独处理

  let commonTemplatesChanged = false;
  let journalTemplateChanged = false;

  // 检查普通模板
  for (const file of commonTemplates) {
    const currentHash = await calculateHash(file);
    if (!buildHashes[file] || buildHashes[file] !== currentHash) {
      newHashes[file] = currentHash;
      commonTemplatesChanged = true;
    }
  }

  // 单独检查碎语模板
  const journalHash = await calculateHash(journalTemplate);
  if (
    !buildHashes[journalTemplate] ||
    buildHashes[journalTemplate] !== journalHash
  ) {
    newHashes[journalTemplate] = journalHash;
    journalTemplateChanged = true;
  }

  return {
    hashes: newHashes,
    commonChanged: commonTemplatesChanged,
    journalChanged: journalTemplateChanged,
  };
}

// 处理静态文件
async function handleStaticFiles(buildHashes = {}) {
  try {
    // 1. 首先检查模板文件变化
    const templateResult = await checkTemplateChanges(buildHashes);

    // 2. 如果普通模板发生变化，清除所有文章的构建缓存
    if (templateResult.commonChanged) {
      console.log("\n模板文件发生变化，将重新构建所有文章...");
      for (const key of Object.keys(buildHashes)) {
        if (key.includes("/content/") || key === "./about.md") {
          delete buildHashes[key];
        }
      }
    }

    // 3. 复制模板样式文件到静态目录
    await copyAndMinifyFile(
      "./src/templates/style.css",
      "./dist/static/style.css"
    );

    // 4. 返回哈希值和变化状态
    return {
      hashes: templateResult.hashes,
      commonChanged: templateResult.commonChanged,
      journalChanged: templateResult.journalChanged,
    };
  } catch (error) {
    console.error("静态文件处理失败:", error);
    throw error;
  }
}

// 处理单个文章
async function processPost(file, buildHashes = {}, isAboutPage = false) {
  // 根据是否是关于页面来确定文件路径，统一使用正斜杠
  const filePath = (isAboutPage ? "./about.md" : `./content/${file}`).replace(
    /\\/g,
    "/"
  );

  try {
    const currentHash = await calculateHash(filePath);
    // 检查文件是否需要更新
    if (!buildHashes[filePath] || buildHashes[filePath] !== currentHash) {
      const template = await fs.readFile("./src/templates/page.html", "utf-8");
      const post = await processMarkdownFile(filePath, template);

      if (!post) {
        throw new Error("文章处理返回空结果");
      }

      console.log("\n处理文章:", {
        title: post.title,
        date: post.date,
        slug: post.slug,
        url: post.url,
      });

      // 根据是否是关于页面决定输出路径
      const outputPath = isAboutPage
        ? "./dist/about.html"
        : path.join("./dist/post", `${post.slug}.html`);

      await fs.writeFile(outputPath, post.html);

      return {
        post,
        hash: currentHash,
      };
    } else {
      // 文件未改变，只获取基本信息
      const post = await getPostBasicInfo(filePath);
      return {
        post,
        hash: null,
      };
    }
  } catch (error) {
    console.error(`处理文章失败 [${file}]:`, error);
    return null;
  }
}

// 处理所有文章
async function handlePosts(buildHashes = {}) {
  const newHashes = {};
  try {
    // 获取当前所有的markdown文件
    const files = await fs.readdir("./content");
    const markdownFiles = files.filter((file) => path.extname(file) === ".md");

    // 获取所有已存在的HTML文件
    const existingHtmlFiles = new Set(
      (await fs.readdir("./dist/post"))
        .filter((file) => file.endsWith(".html"))
        .map((file) => file.replace(".html", ""))
    );

    // 串行处理文章
    const posts = [];
    for (const file of markdownFiles) {
      const result = await processPost(file, buildHashes);
      if (result && result.post) {
        posts.push(result.post);
        if (result.hash) {
          const hashKey = `./content/${file}`;
          newHashes[hashKey] = result.hash;
        }
        // 从existingHtmlFiles中移除已处理的文章
        existingHtmlFiles.delete(result.post.slug);
      }
    }

    // 使用 cleanupOldFiles 函数清理已删除的文章文件
    if (existingHtmlFiles.size > 0) {
      await cleanupOldFiles(existingHtmlFiles, "./dist/post");
    }

    return { posts, newHashes };
  } catch (error) {
    console.error("处理文章集合失败:", error);
    throw error;
  }
}

// 生成站点文件
async function generateSiteFiles(posts, hasChanges = false) {
  try {
    // 总是更新首页
    await fs.writeFile("./dist/index.html", generateIndexHtml(posts));

    // 只在有文章变化时更新feed
    if (hasChanges) {
      await fs.writeFile("./dist/feed", await generateFeed(posts));
      console.log("\n更新RSS feed");
    }
  } catch (error) {
    console.error("生成站点文件失败:", error);
    throw error;
  }
}

// 处理关于页面
async function handleAboutPage(buildHashes = {}) {
  try {
    const result = await processPost("about.md", buildHashes, true);
    if (result) {
      return {
        hash: result.hash,
      };
    }
    return null;
  } catch (error) {
    console.error("处理关于页面失败:", error);
    return null;
  }
}

// 处理碎语页面
async function handleJournals(
  buildHashes = {},
  journalTemplateChanged = false
) {
  try {
    const journalsPath = "./journals.json";
    const outputPath = "./dist/journals.html";

    // 检查输出文件是否存在
    let outputExists = true;
    try {
      await fs.access(outputPath);
    } catch {
      outputExists = false;
    }

    // 获取当前文件的哈希值
    let currentHash = null;
    try {
      currentHash = await calculateHash(journalsPath);
    } catch {
      // journals.json 可能不存在
    }

    // 判断是否需要重建
    const needsRebuild =
      journalTemplateChanged ||
      !outputExists ||
      !buildHashes[journalsPath] ||
      buildHashes[journalsPath] !== currentHash;

    // 处理碎语内容
    const journalsData = await processJournals();
    if (!journalsData) return null;

    const { journals, hasChanges, changeType, count, previousCount } =
      journalsData;

    // 如果需要重建或内容有变化，重新生成页面
    if (needsRebuild || hasChanges) {
      // 根据不同情况输出日志
      if (journalTemplateChanged) {
        console.log("\n📝 碎语模板发生变化，重新生成碎语页面...");
      } else if (!outputExists) {
        console.log("\n📝 生成碎语页面...");
      } else if (hasChanges) {
        switch (changeType) {
          case "added":
            console.log("\n✨ 新增碎语，重新生成碎语页面...");
            break;
          case "deleted":
          case "modified":
            console.log("\n📝 碎语内容已更新，重新生成碎语页面...");
            break;
          case "init":
            console.log("\n📝 初始化碎语页面...");
            break;
        }
      }

      // 生成并写入HTML
      const html = await generateJournalsHtml(journalsData);
      await fs.writeFile(outputPath, html);

      // 返回新的哈希值
      return {
        hash: currentHash || (await calculateHash(journalsPath)),
      };
    }

    return null;
  } catch (error) {
    console.error("处理碎语页面失败:", error);
    return null;
  }
}

// 主构建函数
async function buildSite() {
  try {
    // 1. 创建目录结构
    await createDirectories();

    // 2. 读取构建哈希
    const buildHashes = await readBuildHash();

    // 3. 获取当前所有markdown文件的路径
    const files = await fs.readdir("./content");
    const currentFiles = new Set(files.map((file) => `./content/${file}`));

    // 4. 清理已删除文件的哈希值
    const cleanedHashes = {};
    let hasDeletedFiles = false;
    for (const [key, value] of Object.entries(buildHashes)) {
      if (!key.includes("/content/") || currentFiles.has(key)) {
        cleanedHashes[key] = value;
      } else {
        console.log(`\n清理已删除文章的哈希记录: ${key}`);
        hasDeletedFiles = true;
      }
    }

    // 5. 并行处理静态文件、文章和关于页面
    const [staticResult, postsResult, aboutResult] = await Promise.all([
      handleStaticFiles(cleanedHashes),
      handlePosts(cleanedHashes),
      handleAboutPage(cleanedHashes),
    ]);

    // 6. 处理碎语（只传入碎语模板的变化状态）
    const journalsResult = await handleJournals(
      cleanedHashes,
      staticResult.journalChanged
    );

    // 7. 合并所有哈希值
    const newHashes = {
      ...cleanedHashes,
      ...staticResult.hashes,
      ...postsResult.newHashes,
      ...(aboutResult?.hash ? { "./about.md": aboutResult.hash } : {}),
      ...(journalsResult?.hash
        ? { "./journals.json": journalsResult.hash }
        : {}),
    };

    // 8. 按日期排序文章
    const sortedPosts = postsResult.posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    // 检查是否有文章变化（新增、修改、删除）
    const hasPostChanges =
      Object.keys(postsResult.newHashes).length > 0 || hasDeletedFiles; // 使用 hasDeletedFiles 标记

    // 生成站点文件，传入文章变化状态
    await generateSiteFiles(sortedPosts, hasPostChanges);

    // 9. 保存新的哈希值
    await saveBuildHash(newHashes);

    console.log("\n✨ 构建完成！");
  } catch (error) {
    console.error("❌ 构建失败:", error);
    process.exit(1);
  }
}

buildSite();
