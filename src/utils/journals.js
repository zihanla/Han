import fs from "fs/promises";
import { marked } from "marked";
import { BLOG_CONFIG } from "../config.js";

/**
 * 处理碎语内容
 */
export async function processJournals() {
  try {
    // 1. 读取碎语文件
    const content = await fs.readFile('journals.md', 'utf-8');
    
    // 2. 读取存档
    let archive = [];
    let hasChanges = false;
    let previousCount = 0;
    let changeType = null;
    
    try {
      // 读取原始文件内容
      const archiveContent = await fs.readFile('journals.json', 'utf-8');
      const previousArchive = JSON.parse(archiveContent);
      previousCount = previousArchive.length;
      
      // 直接使用原始数据，而不是复制
      archive = previousArchive;

      // 如果有新内容要添加
      if (content.trim()) {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        
        const newJournal = {
          date: formattedDate,
          content: content.trim()
        };

        archive = [newJournal, ...previousArchive];
        hasChanges = true;
        changeType = 'added';
      }
      // 如果没有新内容，但文件内容与原始内容不同
      else if (JSON.stringify(archive) !== archiveContent) {
        hasChanges = true;
        changeType = archive.length < previousCount ? 'deleted' : 'modified';
      }
    } catch {
      hasChanges = true;
      changeType = 'init';
    }

    // 3. 如果有任何变化，保存文件
    if (hasChanges) {
      await fs.writeFile('journals.json', JSON.stringify(archive, null, 2));
      if (content.trim()) {
        await fs.writeFile('journals.md', '');
      }
    }

    return {
      journals: archive,
      hasChanges,
      changeType,
      count: archive.length,
      previousCount
    };
  } catch (error) {
    console.error('❌ 处理碎语失败:', error);
    throw error;
  }
}

/**
 * 生成碎语HTML
 */
export async function generateJournalsHtml(journalsData) {
  const { journals } = journalsData;
  
  if (!journals?.length) return null;

  // 生成HTML，在这里渲染 Markdown
  const journalsHtml = journals.map(journal => `
    <div class="journal-item">
      <div class="journal-date">${journal.date}</div>
      <div class="journal-content">${marked(journal.content)}</div>
    </div>
  `).join('');

  // 读取并填充模板
  const template = await fs.readFile('./src/templates/journals.html', 'utf-8');
  return template
    .replace(/\$blog_title\$/g, BLOG_CONFIG.title)
    .replace(/\$description\$/g, BLOG_CONFIG.description)
    .replace(/\$keywords\$/g, BLOG_CONFIG.keywords)
    .replace(/\$yearRange\$/g, BLOG_CONFIG.yearRange)
    .replace(/\$author\$/g, BLOG_CONFIG.author)
    .replace('$body$', `
      <div class="journal-items">
        ${journalsHtml}
      </div>
    `)
    .replace(/\$analytics\$/g, BLOG_CONFIG.analytics); // 百度统计代码
}
