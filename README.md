# 依赖
```sh
pnpm install -D prisma@7.10.1 --save-exact
pnpm install @prisma/client@7.10.1 @prisma/adapter-pg@7.10.1 --save-dev
pnpm install pg dotenv
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

# Prisma 开发流程

项目使用 CommonJS，业务代码的相对导入统一省略 `.js` 后缀。
Prisma CLI、客户端和 PostgreSQL 适配器统一使用 7.10.1。

首次启动：

```sh
pnpm install
docker compose -f docker/docker-compose.yml up -d
```

在项目根目录创建 `.env`，设置 `DATABASE_URL`，例如：

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nest_demo?schema=public"
```

用户名、密码和数据库名称需要与本地 PostgreSQL 配置一致。
应用入口先加载 `.env`，Prisma CLI 则通过 `prisma7.config.ts` 加载。

```sh
# 应用已有迁移（首次连接本地数据库）
pnpm exec prisma migrate deploy --config=prisma7.config.ts

# 生成客户端，再启动开发服务
pnpm run prisma:generate
pnpm run start:dev

# 修改 schema.prisma 后，创建并应用开发迁移，再重新生成客户端
pnpm run prisma:migrate --name add_user_field
pnpm run prisma:generate

# 构建会自动生成客户端
pnpm run build
pnpm run start:prod

```

文件职责：

| 文件 | 职责 |
| --- | --- |
| `prisma7.config.ts` | Prisma CLI 的模型路径、迁移路径和数据库连接配置 |
| `prisma/schema.prisma` | 数据模型、客户端生成目录和模块格式 |
| `prisma/migrations/` | 需要提交到 Git 的数据库结构变更记录 |
| `src/prisma/prisma.service.ts` | Nest 数据库服务，管理客户端和连接生命周期 |
| `src/prisma/prisma.module.ts` | 注册并导出 PrismaService |
| `src/generated/prisma/` | 自动生成，不手动编辑；当前被 Git 忽略 |

`prisma generate` 更新客户端代码，不会修改数据库表。
创建用户使用 `POST /user`：

```json
{
  "email": "zhangsan@example.com",
  "name": "张三"
}
```

成功返回 201；参数错误返回 400；邮箱重复返回 409。
