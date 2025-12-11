/**
 * 构建依赖关系管理模块
 *
 * 作用：
 * 1. 定义所有源文件的依赖关系
 * 2. 确定哪些文件变化会影响哪些输出
 * 3. 提供清晰的依赖追踪逻辑
 *
 * 设计原则：
 * - 数据驱动：依赖关系通过数据结构定义，不散落在代码中
 * - 单一职责：只负责依赖关系判断，不做实际构建
 * - 易于维护：新增文件只需修改这个文件
 */

/**
 * 构建依赖定义
 *
 * 依赖分类：
 * - global: 全局依赖，影响所有输出（配置文件）
 * - articleDeps: 文章依赖，影响所有文章页面
 * - indexDeps: 首页依赖，影响首页生成
 * - journalDeps: 碎语依赖，影响碎语页面
 * - feedDeps: RSS依赖，影响feed生成
 */
export const BUILD_DEPS = {
  // 全局配置文件 - 影响所有输出
  global: ["./src/config.js"],

  // 文章相关 - 影响所有文章页面和about页面
  articleDeps: [
    "./src/templates/page.html", // 文章HTML模板
    "./src/templates/style.css", // 全局样式
    "./src/utils/post.js", // Markdown处理逻辑
    "./src/utils/slug.js", // URL生成逻辑
    "./src/utils/date.js", // 日期格式化
  ],

  // 首页相关 - 影响首页生成
  indexDeps: [
    "./src/templates/index.js", // 首页模板
    "./src/templates/style.css", // 全局样式
  ],

  // 碎语相关 - 影响碎语页面
  journalDeps: [
    "./src/templates/journals.html", // 碎语模板
    "./src/templates/style.css", // 全局样式
    "./src/utils/journals.js", // 碎语处理逻辑
  ],

  // RSS相关 - 影响feed生成
  feedDeps: [
    "./src/utils/feed.js", // RSS生成逻辑
    "./src/utils/date.js", // 日期格式化
  ],

  // 行动相关 - 影响行动页面
  doitDeps: [
    "./src/templates/doit.html", // 行动模板
    "./src/templates/style.css", // 全局样式
    "./src/utils/doit.js", // 行动处理逻辑
  ],
};

/**
 * 获取所有需要追踪的源文件
 * @returns {string[]} 所有源文件路径（去重）
 */
export function getAllSourceFiles() {
  const allFiles = [
    ...BUILD_DEPS.global,
    ...BUILD_DEPS.articleDeps,
    ...BUILD_DEPS.indexDeps,
    ...BUILD_DEPS.journalDeps,
    ...BUILD_DEPS.feedDeps,
    ...BUILD_DEPS.doitDeps,
  ];

  // 去重
  return [...new Set(allFiles)];
}

/**
 * 检查是否需要重建文章
 * @param {string[]} changedFiles - 发生变化的文件列表
 * @returns {boolean} 是否需要重建所有文章
 */
export function shouldRebuildArticles(changedFiles) {
  const deps = [...BUILD_DEPS.global, ...BUILD_DEPS.articleDeps];
  return changedFiles.some((file) => deps.includes(file));
}

/**
 * 检查是否需要重建首页
 * @param {string[]} changedFiles - 发生变化的文件列表
 * @returns {boolean} 是否需要重建首页
 */
export function shouldRebuildIndex(changedFiles) {
  const deps = [...BUILD_DEPS.global, ...BUILD_DEPS.indexDeps];
  return changedFiles.some((file) => deps.includes(file));
}

/**
 * 检查是否需要重建碎语
 * @param {string[]} changedFiles - 发生变化的文件列表
 * @returns {boolean} 是否需要重建碎语页面
 */
export function shouldRebuildJournals(changedFiles) {
  const deps = [...BUILD_DEPS.global, ...BUILD_DEPS.journalDeps];
  return changedFiles.some((file) => deps.includes(file));
}

/**
 * 检查是否需要重建RSS
 * @param {string[]} changedFiles - 发生变化的文件列表
 * @returns {boolean} 是否需要重建RSS feed
 */
export function shouldRebuildFeed(changedFiles) {
  const deps = [...BUILD_DEPS.global, ...BUILD_DEPS.feedDeps];
  return changedFiles.some((file) => deps.includes(file));
}

/**
 * 检查是否需要重建行动页面
 * @param {string[]} changedFiles - 发生变化的文件列表
 * @returns {boolean} 是否需要重建行动页面
 */
export function shouldRebuildDoit(changedFiles) {
  const deps = [...BUILD_DEPS.global, ...BUILD_DEPS.doitDeps];
  return changedFiles.some((file) => deps.includes(file));
}
