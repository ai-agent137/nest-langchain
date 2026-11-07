# 依赖
```sh
pnpm install -D prisma@latest  --save-dev
pnpm install @prisma/client@latest
pnpm install @prisma/orm-postgres dotenv
# 以下是在原有项目基础上追加安装，不影响已有依赖
# 核心：LangChain Ollama 集成包
pnpm install @langchain/ollama

# 核心：LangChain 基础类型和接口
pnpm install @langchain/core

# 核心：LangChain 社区集成包（内存向量库 RAG 用）
pnpm install @langchain/community

# 文本分块器（RAG 用）
pnpm install @langchain/textsplitters

# LangChain 主包（MemoryVectorStore 在这里）
pnpm install langchain

# 参数校验（Function Calling / Agents 用）
pnpm install zod
```

# 拉取 Ollama 模型
```sh
# 对话模型（LLM 推理用）
ollama pull qwen3.5:0.8b

# 向量化模型（RAG 检索用）
ollama pull mxbai-embed-large

# 确认已拉取
ollama list
# 应看到：
# NAME                    ID            SIZE
# qwen3.5:0.8b            f3817196d142  1.0 GB
# mxbai-embed-large       819c2adf5ce6  669 MB
```

# prisma 
```sh
# 初始化
npx prisma orm init --yes --target postgres --authoring psl

# 根据模型是否自动生成数据库表

npx prisma migrate dev --name 本次变更的描述

# 生成prisma-client
npx prisma generate --config=prisma7.config.ts

```