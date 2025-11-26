/**
 * Watch 模式 - 文件监听 + HTTP 服务器 + 自动刷新
 *
 * 设计原则（Linus 风格）：
 * 1. 使用最简单的方案：browser-sync（支持 Clean URLs）
 * 2. 清晰的输出：告诉用户该做什么
 * 3. 依赖已有机制：增量构建已经很快
 * 4. 零破坏性：完全不改动构建逻辑
 * 5. 本地与生产一致：Clean URLs 与 Vercel 行为完全匹配
 */

import fs from "fs";
import browserSync from "browser-sync";
import { buildSite } from "../index.js";

/**
 * 防抖函数
 *
 * 为什么需要防抖？
 * - 编辑器保存文件时可能触发多次事件
 * - 避免短时间内重复构建
 *
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 监听路径配置
 *
 * 只监听真正会影响构建的目录和文件：
 * - ./content: Markdown 文章
 * - ./src: 模板和工具代码
 * - ./about.md: 关于页面
 * - ./journals.json: 碎语数据
 */
const WATCH_PATHS = [
  "./content",
  "./src",
  "./about.md",
  "./journals.json",
  "./journals.md", // 监听碎语输入文件，写入后触发构建
];

/**
 * 启动开发服务器 + Watch 模式
 *
 * 核心思路：
 * 1. 首次构建
 * 2. 启动 HTTP 服务器（browser-sync）
 * 3. 监听文件变化，自动重建
 * 4. browser-sync 自动刷新浏览器
 */
export async function startWatch() {
  const PORT = 3000;
  const HOST = "localhost";

  console.log("\n🚀 启动开发服务器...\n");

  // 1. 首次构建
  console.log("⏳ 首次构建中...\n");
  try {
    await buildSite();
    console.log("✨ 构建完成！\n");
  } catch (error) {
    console.error("❌ 首次构建失败:", error.message);
    process.exit(1);
  }

  // 2. 启动 browser-sync 服务器
  const bs = browserSync.create();

  bs.init({
    server: {
      baseDir: "./dist",
      serveStaticOptions: {
        extensions: ["html"], // 🔑 Clean URLs：/journals 自动加载 /journals.html
      },
    },
    port: PORT,
    host: HOST,
    open: false, // 不自动打开浏览器
    notify: false, // 不显示浏览器通知
    ui: false, // 禁用 browser-sync UI 面板
    logLevel: "silent", // 静默模式，我们自己打印日志
  });

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ HTTP 服务器已启动");
  console.log(`\n   👉 打开浏览器访问: http://${HOST}:${PORT}\n`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // 3. 监听文件变化
  console.log("📂 监听文件变化:");
  WATCH_PATHS.forEach((p) => console.log(`   - ${p}`));
  console.log("\n💡 文件变化会自动重建并刷新浏览器");
  console.log("⏹️  按 Ctrl+C 停止服务\n");

  // 防抖处理的重建函数
  const debouncedBuild = debounce(async (eventType, filename) => {
    // 🔍 智能过滤：忽略 journals.md 的清空操作
    if (filename === "journals.md") {
      try {
        const content = await fs.promises.readFile("journals.md", "utf-8");
        if (!content.trim()) {
          // journals.md 被清空了，跳过构建（这是系统自动清空，不是用户写入）
          return;
        }
      } catch {
        // 文件不存在或读取失败，跳过
        return;
      }
    }

    const timestamp = new Date().toLocaleTimeString("zh-CN", { hour12: false });
    console.log(`\n[${timestamp}] 📝 检测到变化: ${filename || "未知文件"}`);
    console.log("⏳ 重新构建中...\n");

    try {
      await buildSite();
      bs.reload(); // 🔄 触发浏览器刷新
      console.log(`✅ 重建完成 - 浏览器会自动刷新\n`);
    } catch (error) {
      console.error("❌ 重建失败:", error.message);
      console.log("继续监听...\n");
    }
  }, 300); // 300ms 防抖延迟

  // 监听所有路径
  const watchers = [];

  for (const watchPath of WATCH_PATHS) {
    try {
      // 检查路径是否存在
      if (!fs.existsSync(watchPath)) {
        continue;
      }

      const isDirectory = fs.statSync(watchPath).isDirectory();

      const watcher = fs.watch(
        watchPath,
        { recursive: isDirectory },
        debouncedBuild
      );

      watchers.push(watcher);
    } catch (error) {
      console.warn(`⚠️  监听路径失败 ${watchPath}:`, error.message);
    }
  }

  if (watchers.length === 0) {
    console.error("❌ 没有成功监听任何路径！");
    process.exit(1);
  }

  // 优雅退出
  process.on("SIGINT", () => {
    console.log("\n\n👋 停止服务...");
    watchers.forEach((w) => w.close());
    bs.exit(); // 关闭 browser-sync 服务器
    process.exit(0);
  });
}

// 如果直接运行此文件，启动 watch 模式
// 直接启动（package.json 中的命令会调用这个文件）
startWatch();
