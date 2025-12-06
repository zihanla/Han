/**
 * Slug 生成模块
 * 将中文标题转换为 URL 友好的格式
 * 例如：'你好世界' => 'ni-hao-shi-jie'
 */
import pinyin from "pinyin";

/**
 * 生成文章的 URL 友好标识符
 * @param {string} title - 文章标题
 * @returns {string} 格式化后的 slug
 */
export function generateSlug(title) {
  try {
    return pinyin(title, {
      style: pinyin.STYLE_NORMAL,
      heteronym: false,
      segment: false,
    })
      .map(pinyinArray => pinyinArray[0])
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  } catch (error) {
    console.warn(`拼音转换失败: ${title}, 使用后备方案`);
    return `article-${new Date().toISOString().split('T')[0]}`;
  }
}