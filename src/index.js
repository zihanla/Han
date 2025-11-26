/**
 * 博客静态站点构建器 - 主入口文件
 *
 * 功能：
 * 1. 增量构建 - 只重建变化的文件
 * 2. 依赖追踪 - 源文件变化自动触发相关内容重建
 * 3. 资源优化 - 压缩 CSS/JS
 * 4. 多内容类型 - 支持文章、碎语、关于页面
 *
 * 构建流程：
 * 1. 检查源文件变化（模板、配置、工具模块）
 * 2. 根据依赖关系决定需要重建的内容
 * 3. 处理各类内容（文章、碎语、关于页面）
 * 4. 生成首页和 RSS
 * 5. 保存构建缓存
 */
import fs from "fs/promises";
import path from "path";
import CleanCSS from "clean-css";
import { minify } from "terser";
import { calculateHash, readBuildHash, saveBuildHash } from "./utils/hash.js";
import { processMarkdownFile, getPostBasicInfo } from "./utils/post.js";
import { generateFeed } from "./utils/feed.js";
import { generateIndexHtml } from "./templates/index.js";
import { processJournals, generateJournalsHtml } from "./utils/journals.js";
import { PATHS } from "./config.js";
import {
  getAllSourceFiles,
  shouldRebuildArticles,
  shouldRebuildJournals,
} from "./build-deps.js";

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

/**
 * 检查源文件变化
 *
 * 追踪所有会影响构建结果的源文件：
 * - 配置文件（config.js）
 * - 模板文件（HTML/CSS）
 * - 工具模块（utils/*.js）
 *
 * 关键改进：完整的依赖追踪
 * - 之前只追踪模板，现在追踪所有源文件
 * - 修改任何源文件都会正确触发重建
 *
 * @param {Object} buildHashes - 上次构建的哈希记录
 * @returns {Object} 变化的文件信息
 */
async function checkSourceChanges(buildHashes = {}) {
  const changedFiles = [];
  const newHashes = {};

  // 获取所有需要追踪的源文件
  const sourceFiles = getAllSourceFiles();

  // 检查每个源文件是否变化
  for (const file of sourceFiles) {
    try {
      const currentHash = await calculateHash(file);
      const previousHash = buildHashes[file];

      // 文件变化或首次构建
      if (!previousHash || previousHash !== currentHash) {
        changedFiles.push(file);
        newHashes[file] = currentHash;
      }
    } catch (error) {
      // 文件可能不存在或无法读取，跳过
      console.warn(`无法读取源文件 ${file}:`, error.message);
    }
  }

  // 根据变化的文件判断需要重建的内容
  return {
    changedFiles,
    newHashes,
    needRebuildArticles: shouldRebuildArticles(changedFiles),
    needRebuildJournals: shouldRebuildJournals(changedFiles),
  };
}

/**
 * 处理静态文件
 *
 * 职责：复制并压缩 CSS 文件到输出目录
 * 注意：不再处理缓存清理逻辑（已移到主构建函数）
 */
async function handleStaticFiles() {
  try {
    await copyAndMinifyFile(
      PATHS.templateStyle,
      `${PATHS.distStatic}/style.css`
    );
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

/**
 * 主构建函数
 *
 * 构建流程：
 * 1. 检查源文件变化（配置、模板、工具模块）
 * 2. 根据依赖关系清理缓存
 * 3. 并行处理各类内容
 * 4. 生成首页和 RSS
 * 5. 保存构建缓存
 */
async function buildSite() {
  try {
    // 1. 创建输出目录
    await createDirectories();

    // 2. 读取上次构建的哈希记录
    const buildHashes = await readBuildHash();

    // 3. 检查源文件变化（关键改进：完整的依赖追踪）
    const sourceChanges = await checkSourceChanges(buildHashes);

    // 如果源文件有变化，清理受影响内容的缓存
    let cleanedHashes = { ...buildHashes };
    if (sourceChanges.needRebuildArticles) {
      console.log("\n源文件变化，将重新构建所有文章...");
      // 清除所有文章和about页面的缓存
      for (const key of Object.keys(cleanedHashes)) {
        if (key.includes("/content/") || key === PATHS.about) {
          delete cleanedHashes[key];
        }
      }
    }

    // 4. 清理已删除文章的哈希记录
    const files = await fs.readdir(PATHS.content);
    const currentFiles = new Set(
      files.map((file) => `${PATHS.content}/${file}`)
    );
    let hasDeletedFiles = false;

    for (const key of Object.keys(cleanedHashes)) {
      if (key.includes("/content/") && !currentFiles.has(key)) {
        console.log(`清理已删除文章: ${key}`);
        delete cleanedHashes[key];
        hasDeletedFiles = true;
      }
    }

    // 5. 并行处理静态文件、文章和关于页面
    const [, postsResult, aboutResult] = await Promise.all([
      handleStaticFiles(),
      handlePosts(cleanedHashes),
      handleAboutPage(cleanedHashes),
    ]);

    // 6. 处理碎语页面
    const journalsResult = await handleJournals(
      cleanedHashes,
      sourceChanges.needRebuildJournals
    );

    // 7. 合并所有哈希值（简化逻辑）
    const newHashes = { ...cleanedHashes };

    // 添加源文件哈希
    Object.assign(newHashes, sourceChanges.newHashes);

    // 添加文章哈希
    Object.assign(newHashes, postsResult.newHashes);

    // 添加关于页面哈希
    if (aboutResult?.hash) {
      newHashes[PATHS.about] = aboutResult.hash;
    }

    // 添加碎语哈希
    if (journalsResult?.hash) {
      newHashes[PATHS.journals] = journalsResult.hash;
    }

    // 8. 按日期排序文章
    const sortedPosts = postsResult.posts.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    // 9. 生成首页和 RSS（文章变化时更新 RSS）
    const hasPostChanges =
      Object.keys(postsResult.newHashes).length > 0 || hasDeletedFiles;
    await generateSiteFiles(sortedPosts, hasPostChanges);

    // 10. 保存新的哈希记录
    await saveBuildHash(newHashes);

    console.log("\n✨ 构建完成！");
  } catch (error) {
    console.error("❌ 构建失败:", error);
    process.exit(1);
  }
}

buildSite();
