/**
 * 格式化日期
 * @param {Date|string} date - 要格式化的日期
 * @param {string} format - 输出格式 ('iso' | 'rss' | 'full' | 'display' | 'detail')
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = "iso") {
  // 处理已有的日期字符串
  if (typeof date === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    if (date.includes(":")) {
      return format === "display" ? date.split(" ")[0] : date;
    }
  }

  // 只返回日期部分
  const d = new Date(date);
  const pad = (num) => String(num).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * 获取完整的时间戳
 * 用于文章排序
 */
export function getTimestamp(date) {
  const d = new Date(date);
  return isNaN(d.getTime()) ? new Date().getTime() : d.getTime();
}
