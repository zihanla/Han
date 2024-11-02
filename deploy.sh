#!/bin/bash

echo "🚀 开始部署..."
pnpm build && git add . && git commit -m "update" && git push
echo "✨ 部署完成！"
