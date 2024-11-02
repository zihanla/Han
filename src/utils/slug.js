/**
 * Slug 生成模块
 * 
 * 作用：将中文标题转换为 URL 友好的格式
 * 例如：'你好世界' => 'ni-hao-shi-jie'
 * 
 * 在整体项目中的作用：
 * 1. 生成文章的 URL 路径
 * 2. 生成文章的文件名
 * 3. 确保 URL 的唯一性和可读性
 */
import pinyin from "pinyin";

// 记录已使用的 slugs，避免重复
const usedSlugs = new Set();

/**
 * 生成文章的 URL 友好标识符
 * @param {string} title - 文章标题
 * @returns {string} 格式化后的 slug
 * 
 * @example
 * generateSlug('你好世界')     // 'ni-hao-shi-jie'
 * generateSlug('你好世界')     // 'ni-hao-shi-jie-1' (重复时)
 * generateSlug('Hello World') // 'hello-world'
 */
export function generateSlug(title) {
  try {
    // 生成基础 slug: 转拼音、小写、替换特殊字符
    let slug = pinyin(title, {
      style: pinyin.STYLE_NORMAL,
      heteronym: false,
      segment: false,
    })
      .map(pinyinArray => pinyinArray[0])
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // 处理重复: 如果 slug 已存在，添加数字后缀
    let finalSlug = slug;
    let counter = 1;
    while (usedSlugs.has(finalSlug)) {
      finalSlug = `${slug}-${counter++}`;
    }
    usedSlugs.add(finalSlug);
    
    return finalSlug;
  } catch (error) {
    // 转换失败时使用后备方案：article-日期
    console.warn(`拼音转换失败: ${title}, 使用后备方案`);
    const date = new Date().toISOString().split('T')[0];
    return `article-${date}`;
  }
}