import fs from "fs/promises";
import { BLOG_CONFIG, PATHS } from "../config.js";

/**
 * 解析时间字符串（如 "8.18" -> 8.18 小时）
 */
function parseTime(timeStr) {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(".").map(Number);
  return hours + (minutes || 0) / 60;
}

/**
 * 格式化时间显示（如 "8.18" -> "8:18"）
 */
function formatTime(timeStr) {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(".");
  return `${hours}:${minutes?.padStart(2, "0") || "00"}`;
}

/**
 * 格式化步数为万步（如 58072 -> "5.8万"）
 */
function formatStepsAsWan(steps) {
  if (steps >= 10000) {
    return (steps / 10000).toFixed(1) + "万";
  }
  return steps.toLocaleString();
}

/**
 * 从日期字符串提取月日用于显示（如 "2025.07.25" -> "07.25"）
 */
function extractMonthDay(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split(".");
  // 支持 "2025.07.25" 或 "07.25" 格式
  if (parts.length === 3) {
    return `${parts[1]}.${parts[2]}`;
  }
  return dateStr;
}

/**
 * 从日期字符串提取年份（如 "2025.07.25" -> "2025"）
 */
function extractYear(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split(".");
  if (parts.length === 3) {
    return parts[0];
  }
  return null;
}

/**
 * 计算统计数据（扁平化结构：record.gongtougong）
 */
function calculateSummary(records) {
  let earlyWakeCount = 0;
  let totalSteps = 0;
  let totalGongtougong = 0;

  for (const record of records) {
    // 早起统计
    const wakeTime = parseTime(record.wake);
    if (wakeTime !== null && wakeTime < 8) {
      earlyWakeCount++;
    }

    // 步数统计
    if (record.steps) {
      totalSteps += record.steps;
    }

    // 拱头功统计（扁平化：直接访问 record.gongtougong）
    if (record.gongtougong) {
      totalGongtougong += record.gongtougong;
    }
  }

  return {
    earlyWakeCount,
    totalSteps,
    totalGongtougong,
    totalDays: records.length,
  };
}

/**
 * 生成单条记录 HTML（扁平化结构）
 */
function generateRecordHtml(record) {
  const parts = [];

  // 日期（只显示月.日）
  const displayDate = extractMonthDay(record.date);
  parts.push(`<span class="doit-date">${displayDate}</span>`);

  // 睡眠时间
  if (record.sleep) {
    parts.push(
      `<span class="doit-sleep">${formatTime(record.sleep)} 睡</span>`
    );
  }

  // 起床时间
  if (record.wake) {
    parts.push(`<span class="doit-wake">${formatTime(record.wake)} 起</span>`);
  }

  // 步数
  if (record.steps) {
    parts.push(
      `<span class="doit-steps">${record.steps.toLocaleString()} 步</span>`
    );
  }

  // 拱头功（扁平化：直接访问 record.gongtougong）
  if (record.gongtougong) {
    parts.push(
      `<span class="doit-exercise">拱头功 ${record.gongtougong} 个</span>`
    );
  }

  return `<div class="doit-item">${parts.join(" ")}</div>`;
}

/**
 * 生成总览 HTML
 */
function generateSummaryHtml(summary) {
  return `
    <div class="doit-summary-item">
      <span class="summary-label">早起（<8点）</span>
      <span class="summary-value">${summary.earlyWakeCount} 次</span>
    </div>
    <div class="doit-summary-item">
      <span class="summary-label">拱头功</span>
      <span class="summary-value">${summary.totalGongtougong} 个</span>
    </div>
    <div class="doit-summary-item">
      <span class="summary-label">总步数</span>
      <span class="summary-value">${formatStepsAsWan(
        summary.totalSteps
      )} 步</span>
    </div>
  `;
}

/**
 * 处理行动数据
 * 支持扁平数组格式：[{ "date": "2025.07.25", ... }]
 */
export async function processDoitData() {
  try {
    const content = await fs.readFile(PATHS.doit, "utf-8");
    const data = JSON.parse(content);

    // 扁平数组格式
    if (Array.isArray(data)) {
      // 按日期降序排序
      const records = data.sort((a, b) => {
        // "2025.07.25" 格式可直接字符串比较
        return (b.date || "").localeCompare(a.date || "");
      });

      // 提取年份（从第一条记录）
      const year = records.length > 0 ? extractYear(records[0].date) : null;

      return { year, records };
    }

    // 兼容旧的按年份分组格式
    const currentYear = new Date().getFullYear().toString();
    const years = Object.keys(data).sort((a, b) => b - a);
    const targetYear = years.includes(currentYear) ? currentYear : years[0];

    return {
      year: targetYear,
      records: data[targetYear] || [],
    };
  } catch (error) {
    console.warn("读取行动数据失败:", error.message);
    return { year: null, records: [] };
  }
}

/**
 * 生成行动页面 HTML
 */
export async function generateDoitHtml(doitData) {
  const { records } = doitData;

  if (!records?.length) return null;

  // 计算统计数据
  const summary = calculateSummary(records);

  // 生成记录列表 HTML
  const recordsHtml = records.map(generateRecordHtml).join("");

  // 生成总览 HTML
  const summaryHtml = generateSummaryHtml(summary);

  // 读取并填充模板
  const template = await fs.readFile(PATHS.templateDoit, "utf-8");
  return template
    .replace(/\$blog_title\$/g, BLOG_CONFIG.title)
    .replace(/\$description\$/g, BLOG_CONFIG.description)
    .replace(/\$keywords\$/g, BLOG_CONFIG.keywords)
    .replace(/\$yearRange\$/g, BLOG_CONFIG.yearRange)
    .replace(/\$author\$/g, BLOG_CONFIG.author)
    .replace("$summary$", summaryHtml)
    .replace("$body$", recordsHtml)
    .replace(/\$analytics\$/g, BLOG_CONFIG.analytics);
}
