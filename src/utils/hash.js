/**
 * 哈希处理模块
 * 用于跟踪文件变化,实现增量构建
 * 只有发生变化的文件才会重新构建,提高构建效率
 */
import fs from "fs/promises";
import crypto from "crypto";
import { HASH_FILE } from "../config.js";

/**
 * 计算文件的 MD5 哈希值
 * @param {string} filePath - 文件路径
 * @returns {string} 32位的MD5哈希字符串
 * 
 * @example
 * // 输出: "5d41402abc4b2a76b9719d911017c592"
 * const hash = await calculateHash("./content/hello.md")
 */
export async function calculateHash(filePath) {
  // 读取文件内容
  const content = await fs.readFile(filePath);
  // 计算 MD5 哈希值
  return crypto.createHash("md5").update(content).digest("hex");
}

/**
 * 读取上次构建的哈希记录
 * @returns {Object} 文件路径到哈希值的映射
 * 
 * @example
 * // 输出: { "./content/hello.md": "5d41402abc4b2a76b9719d911017c592" }
 * const hashes = await readBuildHash()
 */
export async function readBuildHash() {
  try {
    const data = await fs.readFile(HASH_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    // 如果文件不存在或读取失败,返回空对象
    return {};
  }
}

/**
 * 保存本次构建的哈希记录
 * @param {Object} hashes - 文件路径到哈希值的映射
 */
export async function saveBuildHash(hashes) {
  await fs.writeFile(HASH_FILE, JSON.stringify(hashes, null, 2));
}
