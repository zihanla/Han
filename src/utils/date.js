/**
 * 格式化日期
 * @param {Date|string} date - 要格式化的日期
 * @param {string} format - 输出格式 ('iso' | 'rss' | 'full' | 'display' | 'detail')
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}
export function getTimestamp(date) {
  const d = new Date(date);
  return isNaN(d.getTime()) ? new Date().getTime() : d.getTime();
}

/**
 * 获取相对时间
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function getRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;

  // 转换为秒
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return "刚刚";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}分钟前`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}小时前`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}天前`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}个月前`;
  }

  const years = Math.floor(months / 12);
  return `${years}年前`;
}
