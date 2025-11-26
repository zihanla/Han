# Han

hexo,hugo,halo,typecho,这些项目给我的心理负担太大，那会儿想写个自己的样式，要看的东西很多，文档有不是那么全，自 cursor 出来，我做了第一个 python 版本，仓库可见我就不贴了，后来还是觉得太重了，我只想分享我当下的情绪，不再有其它元素，只需要写文字就好了，于是 Han 就诞生了，这是我第三次重构了，Ai 时代真的很感慨，每一次重构基本都见证了 Ai 能力的提升，极大的帮助了我

---

## 快速开始

### 1. 安装

下载项目

```bash
git clone https://github.com/zihanla/Han.git
```

安装依赖 习惯用这个了 不习惯记得修改下 package.json

```bash
npm i pnpm -g
```

```bash
pnpm i
```

### 2. 清空现有内容（可选）

依赖安装完就可以直接预览项目了

```bash
pnpm dev
```

我比较懒 就没有删除我自己的文章，正好可以用来熟悉 Han

清除是 Ai 给的命令 要是不行 就换一个 我不记命令来着

```bash
# 删除示例文章
rm -rf content/*

# 清空碎语
echo "[]" > journals.json
```

### 3. 写第一篇文章

在 `content/` 目录创建 `.md` 文件，文件名就是标题：

```bash
# 文件名可以是中文
echo "这是我的第一篇文章" > content/我的第一篇博客.md
```

编辑文件，直接写内容（不需要 frontmatter，程序会自动生成）：

```markdown
这是正文内容。支持 **Markdown** 语法。

## 小标题

- 列表项 1
- 列表项 2
```

### 4. 构建

```bash
pnpm build
```

生成的网站在 `dist/` 目录。

### 5. 开发模式（推荐）

启动开发服务器，文件变化自动重建 + 浏览器自动刷新：

```bash
pnpm dev
```

**输出示例：**

```
🚀 启动开发服务器...

⏳ 首次构建中...

✨ 构建完成！

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ HTTP 服务器已启动

   👉 打开浏览器访问: http://localhost:3000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 监听文件变化:
   - ./content
   - ./src
   - ./about.md
   - ./journals.json
   - ./journals.md

💡 文件变化会自动重建并刷新浏览器
⏹️  按 Ctrl+C 停止服务
```

修改任何文件，保存后：

- ✅ 自动重建
- ✅ 浏览器自动刷新
- ✅ 实时看到效果

---

## 核心功能

### 写文章

1. **创建文章**：在 `content/` 目录创建 `.md` 文件
2. **文件名 = 标题**：`大理旅行.md` → 标题自动提取为"大理旅行"
3. **直接写内容**：不需要手动添加 frontmatter
4. **自动处理**：
   - 标题自动从文件名提取
   - 中文标题自动转拼音 URL（`大理旅行.md` → `/post/da-li-lv-xing`）
   - 日期自动添加
   - 作者自动填充（在 `src/config.js` 配置）

**示例**：

```markdown
> 周末去了大理

## 第一天

早上出发...

## 第二天

继续游玩...
```

保存，运行 `pnpm build`，完成。

---

### 写碎念（Journals）

快速记录想法：

1. **编辑** `journals.md` 文件：

```markdown
今天学会了 TypeScript 泛型，太爽了！
```

2. **运行** `pnpm build`

3. **自动处理**：
   - 添加时间戳
   - 追加到 `journals.json`
   - 清空 `journals.md`（为下次做准备）
   - 生成碎念页面 `dist/journals.html`

---

### 删除文章

直接删除 `content/` 目录下的 `.md` 文件，运行 `pnpm build`，相关文件会自动清理。

---

### 修改配置

编辑 `src/config.js`：

```javascript
export const BLOG_CONFIG = {
  title: "你的博客名",
  author: "你的名字",
  description: "博客描述",
  email: "your@email.com",
  // ...
};

export const BLOG_URL = "https://your-domain.com";
```

---

## 自动化功能

你 **不需要手动处理** 以下内容：

- ✅ **Frontmatter**：标题、作者、URL、日期自动生成
- ✅ **URL 转换**：中文标题自动转拼音
- ✅ **代码高亮**：检测到代码块自动加载高亮库
- ✅ **图片优化**：自动添加懒加载和响应式容器
- ✅ **增量构建**：只重建变化的文件
- ✅ **资源压缩**：CSS/JS 自动压缩
- ✅ **RSS Feed**：自动生成订阅源
- ✅ **文件清理**：删除文章后自动清理相关文件

程序会处理这一切。你只需要写内容。

---

## 命令

- `pnpm build` - 构建一次
- `pnpm dev` - 开发模式（文件变化自动重建）
- `pnpm d` - 构建 + Git 提交推送（快捷部署）

---

## 项目结构

```
content/           # 你的文章（Markdown 文件）
journals.md        # 碎念输入（临时文件）
journals.json      # 碎念存储
about.md           # 关于页面
src/config.js      # 配置文件（修改博客信息）
dist/              # 生成的网站
```

---

## 部署

`dist/` 目录是生成的静态网站，复制到任何静态托管服务：

## 我部署在 vercel 上，如果你也要再上面部署就很简单，直接上传 GitHub 在 Vercel 选中 Han 就可以了不需要多的配置 别的我不知道 部署到服务器啥的都可以 配置问 ai 因为我没有

## 修改

结构非常简单
src/template/ 这个就是模板主题 修改 html 等就行了 你会看到没有任何额外的负担 直接让 Ai 修改这里 丢一个你喜欢的页面给他参考就行

剩下的板块要改 丢给 Ai 就行 注释很详细 这个版本 C4.5 验证过几遍 没有显眼 bug

干就完了 从文字开始
