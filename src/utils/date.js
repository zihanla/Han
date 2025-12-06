/**
 * 格式化日期
 * @param {string} dateString - 日期字符串
 * @param {string} format - 输出格式 ('short' | 'detail' | 'full')
 *   - short: 2024/10/09 (首页/归档用)
 *   - detail: 2024年10月09日 22:34 (文章详情页用)
 *   - full: 有时分显示时分，没有只显示日期 (碎语用)
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(dateString, format = "short") {
  // 统一处理日期字符串，支持 "2024-10-09 22:34" 和 "2024/10/09 22:34" 格式
  const normalized = String(dateString).replace(/-/g, "/");
  const hasTime = /\d{2}:\d{2}/.test(normalized);

  const date = new Date(normalized);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  switch (format) {
    case "detail":
      // 文章详情页：2024年10月09日 22:34
      return hasTime
        ? `${year}年${month}月${day}日 ${hours}:${minutes}`
        : `${year}年${month}月${day}日`;

    case "full":
      // 碎语页：返回对象，日期和时间分开
      return {
        date: `${year}/${month}/${day}`,
        time: hasTime ? `${hours}:${minutes}` : null,
      };

    case "short":
    default:
      // 首页/归档：只显示日期
      return `${year}/${month}/${day}`;
  }
}
