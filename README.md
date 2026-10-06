<div align="center">
  <!-- <img src="https://likedo.vercel.app/_static/images/x-preview.png" alt="WR.DO" > -->
  <h1>WR.DO</h1>
  <p>一站式域名服务平台，集成短链服务、临时邮箱、子域名管理、文件存储和开放API接口。</p>
  <p>
    <a href="https://like.do">官方站点</a> · <a href="https://likedo.vercel.app/docs/developer">部署文档</a> · <a href="https://likedo.vercel.app/feedback">反馈讨论</a> · <a href="/README-en.md">English</a> | 简体中文
  </p>
  <img alt="Vercel" src="https://img.shields.io/badge/vercel-online-55b467?labelColor=black&logo=vercel&style=flat-square">
  <img alt="Release" src="https://img.shields.io/github/actions/workflow/status/oiov/wr.do/docker-build-push.yml?label=release&labelColor=black&logo=githubactions&logoColor=white&style=flat-square">
  <img alt="Release" src="https://img.shields.io/github/release-date/oiov/wr.do?labelColor=black&style=flat-square">
  <img alt="GitHub Release" src="https://img.shields.io/github/v/release/oiov/wr.do?style=flat-square&label=latest"><br>
  <img src="https://img.shields.io/github/contributors/oiov/wr.do?color=c4f042&labelColor=black&style=flat-square" alt="contributors"/>
  <img src="https://img.shields.io/github/stars/oiov/wr.do.svg?logo=github&style=flat-square" alt="star"/>
  <img alt="GitHub forks" src="https://img.shields.io/github/forks/oiov/wr.do?style=flat-square">
  <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/oiov/wr.do?style=flat-square"> <br>
  <img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/oiov/wr.do/docker-build-push.yml?style=flat-square">
	<img src="https://img.shields.io/github/license/oiov/wr.do?style=flat-square" alt="MIT"/><br><br>
  <!-- <img width="15" src="https://storage.wr.do/2025/11/20/561763627504_.pic.jpg" /> 免费体验 Sora AI 视频生成 👉 <a href="https://sora.hk/i/5KY5N1FL">点击注册</a> -->
</div>

<img align="center" width="50%" alt="og-banner" src="https://github.com/user-attachments/assets/b338bfca-71ed-447a-bde5-18e5677cb8dc" />

> 🌟 推荐 **Claude**、**OpenAI** 稳定 API 网关：[nbility.ai](https://nbility.ai//auth/register?aff=Dptp) ，支持 claude-fable-5、gpt-5.6-sol 等主流 AI Coding 大模型🥳

## 版本说明

- 开源版 Demo：[likedo.vercel.app](https://likedo.vercel.app)
- 运营版 LikeDo：[like.do](https://like.do) ，集成 [AI Agent](https://like.do/zh/docs/user-guide/ai-chat-assistant) 统一调度管理站内资源，内置[激励共创系统](https://like.do/zh/blog/introducing-co-creation-program)，点击使用[邀请码注册](https://like.do/auth/register?ref=DAR5HDV4) 。

## 截图预览

<table>
  <tr>
    <td><img src="https://likedo.vercel.app/_static/images/light-preview.png" /></td>
    <td><img src="https://likedo.vercel.app/_static/images/example_02.png" /></td>
  </tr>
  <tr>
    <td><img src="https://likedo.vercel.app/_static/images/example_01.png" /></td>
    <td><img src="https://likedo.vercel.app/_static/images/realtime-globe.png" /></td>
  </tr>
  <tr>
    <td><img src="https://likedo.vercel.app/_static/images/example_03.png" /></td>
    <td><img src="https://likedo.vercel.app/_static/images/domains.png" /></td>
  </tr>
</table>


## 功能列表

<details>
<summary><strong> 🔗 短链服务</strong> - <a href="javascript:;">[功能列表]</a></summary>
<ul>
<li>支持自定义短链</li>
<li>支持生成自定义二维码</li>
<li>支持密码保护链接</li>
<li>支持设置过期时间</li>
<li>支持访问统计（实时日志、地图等多维度数据分析）</li>
<li>支持调用 API 创建短链</li>
</ul>
</details>

<details>
<summary><strong> 📮 域名邮箱服务</strong> - <a href="javascript:;">[功能列表]</a></summary>
<ul>
<li>支持创建自定义前缀邮箱</li>
<li>支持过滤未读邮件列表</li>
<li>可创建无限数量邮箱</li>
<li>支持接收无限制邮件 （依赖 Cloudflare Email Worker）</li>
<li>支持发送邮件（依赖 Resend）</li>
<li>支持 Catch-All 配置</li>
<li>支持 Telegram 推送（多频道/群组）</li>
<li>支持调用 API 创建邮箱</li>
<li>支持调用 API 获取收件箱邮件</li>
</ul>
</details>

<details>
<summary><strong>🌐 子域名管理服务</strong> - <a href="javascript:;">[功能列表]</a></summary>
<ul>
<li>支持管理多 Cloudflare 账户下的多个域名的 DNS 记录</li>
<li>支持创建多种 DNS 记录类型（CNAME、A、TXT 等）</li>
<li>支持开启申请模式（用户提交、管理员审批）</li>
<li>支持邮件通知管理员、用户域名申请状态</li>
</ul>
</details>

<details>
<summary><strong>📂 文件存储服务</strong> - <a href="javascript:;">[功能列表]</a></summary>
<ul>
<li>支持多渠道（S3 API）云存储平台（Cloudflare R2、AWS S3、OSS等）
<li>支持单渠道多存储桶配置
<li>动态配置文件上传大小限制
<li>支持拖拽、批量、粘贴上传文件
<li>支持批量删除文件
<li>快捷生成文件短链、二维码
<li>支持部分文件在线预览内容
</ul>
</details>

<details>
<summary><strong>📡 开放接口服务</strong> - <a href="javascript:;">[功能列表]</a></summary>
<ul>
<li>支持调用 API 获取网站元数据
<li>支持调用 API 获取网站截图
<li>支持调用 API 生成网站二维码
<li>支持调用 API 将网站转换为 Markdown、Text
<li>支持生成用户 API Key，用于第三方调用开放接口
</ul>
</details>

<details>
<summary><strong>👑 管理员模块</strong> - <a href="javascript:;">[功能列表]</a></summary>
<ul>
<li>多维度图表展示网站状态
<li>域名服务配置（动态配置各项服务是否启用，包括短链、临时邮箱（收发邮件）
<li>用户列表管理（设置权限、分配使用额度、禁用用户等）
<li>动态配置登录方式 (支持 Google, GitHub, 邮箱验证, 账户密码, LinuxDO)
<li>短链管理（管理所有用户创建的短链）
<li>邮箱管理（管理所有用户创建的临时邮箱）
<li>子域名管理（管理所有用户创建的子域名）
</ul>
</details>

## 技术栈

- Next.js + React + TypeScript
- Tailwind CSS 用于样式设计
- Prisma ORM 作为数据库工具
- Cloudflare 作为主要的云基础设施
- Vercel 作为推荐的部署平台
- Resend 作为邮件服务
- Next-Intl 作为国际化支持

## 快速开始

查看开发者[手把手部署教程](https://likedo.vercel.app/docs/developer/quick-start-zh)文档。

## 自部署教程

> 部署前请先配置环境变量。修改容器运行时环境变量后，需要重建容器才会生效。

### 使用 Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/oiov/wr.do.git&project-name=wrdo)

部署前设置 `DATABASE_URL`、`AUTH_URL` 和随机的 `AUTH_SECRET`（使用 `openssl rand -base64 32` 生成）。如果没有可用管理员，还须设置 `BOOTSTRAP_ADMIN_EMAIL` 和 `BOOTSTRAP_ADMIN_PASSWORD`；构建时会自动初始化管理员。密码至少 16 位，含至少 8 种不同字符。

### 使用 Docker Compose 部署

官方镜像发布在 [GitHub Container Registry](https://github.com/oiov/wr.do/pkgs/container/wr.do%2Fwrdo)：`ghcr.io/oiov/wr.do/wrdo:main`（也可使用 `latest`）。无需在服务器上构建镜像。

Docker 镜像在构建时从 npm 自动获取 GeoLite2 City 数据库，用于补齐短链访客地理信息；无需 MaxMind 账号或手动挂载。Vercel 不需要该数据库。更新方法和代理配置见[部署文档](https://likedo.vercel.app/docs/developer/deploy-zh)。

在服务器中创建一个文件夹，下载仓库中的 [docker-compose.yml](https://github.com/oiov/wr.do/blob/main/docker-compose.yml) 和 [.env.example](https://github.com/oiov/wr.do/blob/main/.env.example)，将后者重命名为 `.env`：

```yml
- wrdo
  | - docker-compose.yml
  | - .env
```

准备好 PostgreSQL 数据库，在 `.env` 中填写 `DATABASE_URL`、`AUTH_URL` 和其他所需配置。使用 `openssl rand -base64 32` 生成 `AUTH_SECRET`。首次部署还须设置 `BOOTSTRAP_ADMIN_EMAIL`（个人邮箱）和至少 16 位的 `BOOTSTRAP_ADMIN_PASSWORD`；已有可用管理员的实例不需要填写这两项。然后拉取并启动镜像：

```bash
docker compose pull
docker compose up -d
```

修改 `.env` 中的服务端变量后，执行 `docker compose up -d --force-recreate`。镜像构建时不会注入任何部署者的 GitHub Secrets；`DATABASE_URL`、`AUTH_SECRET` 等实例专属配置由容器启动时提供。

首次管理员创建成功后，从 `.env` 移除 `BOOTSTRAP_ADMIN_PASSWORD` 并重新创建容器。升级时，仍使用出厂密码的 `admin@admin.com` 会被停用；已修改密码的账号不受影响。如果没有其他可用管理员，升级前先配置上述两项初始化凭据。不要随意更换已有实例的 `AUTH_SECRET`，否则现有登录会话会失效。

> 注意：Next.js 会将客户端使用的 `NEXT_PUBLIC_*` 变量在构建时写入浏览器代码。预构建的公共镜像无法通过容器启动时的 `.env` 更改这些客户端值；如果部署需要自定义站点 URL、名称或其他客户端配置，需要从源码构建并在执行 `pnpm run build` 前提供这些变量。目前不能保证仅靠公共镜像完成这些客户端配置。

## 本地开发

将 `.env.example` 复制为 `.env` 并填写必要的环境变量。

```bash
git clone https://github.com/oiov/wr.do
cd wr.do
pnpm install
```

#### 初始化数据库

```bash
pnpm postinstall
pnpm db:push
pnpm bootstrap-admin
```

```bash
# 在 localhost:3000 上运行
pnpm dev
```

管理员使用 `.env` 中的 `BOOTSTRAP_ADMIN_EMAIL` 和 `BOOTSTRAP_ADMIN_PASSWORD` 初始化。`AUTH_SECRET` 必须是至少 32 字节的随机值。

## 环境变量

查看 [开发者文档](https://likedo.vercel.app/docs/developer).

## Fork 仓库同步

本项目配置了与上游仓库 [oiov/wr.do](https://github.com/oiov/wr.do) 的同步工作流，支持：

- 🔄 **手动触发同步** - 默认关闭自动同步，完全控制同步时机
- 💬 **同步后自动评论** - 在相关 commit 上添加详细的同步信息
- 🚨 **智能错误处理** - 同步失败时自动创建详细的 Issue
- 🧹 **自动清理通知** - 自动关闭之前的同步失败 Issue

前往[如何手动触发同步](https://likedo.vercel.app/docs/developer/sync)查看详细文档。

## 社区群组

- Discord: https://uv.do/disc
- 微信群：

<img width="300" src="https://wr.do/group" />

## 贡献者

<a href="https://github.com/oiov/wr.do/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=oiov/wr.do" />
</a>

## Star History

<a href="https://star-history.com/#oiov/wr.do&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=oiov/wr.do&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=oiov/wr.do&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=oiov/wr.do&type=Date" />
 </picture>
</a>

## 开源协议

[MIT](/LICENSE.md)






