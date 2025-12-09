<div align="center">
  <img src="https://likedo.vercel.app/_static/images/x-preview.png" alt="WR.DO" >
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
  <img width="15" src="https://storage.wr.do/2025/11/20/561763627504_.pic.jpg" /> 免费体验 Sora AI 视频生成 👉 <a href="https://sora.hk/i/5KY5N1FL">点击注册</a>
</div>

## 📢 重要通知：推出官方运营版 LikeDo

经过一年的开源运营，WR.DO 已积累了稳定的用户基础和成熟的技术条件。**为了持续维护和提供更好的服务**，我们正式推出官方运营版 **LikeDo**。

### 🔄 版本说明

- **开源版 WR.DO**：将继续维护，演示域名变更为 https://likedo.vercel.app
- **官方运营版 LikeDo**：独立数据库运营，域名为 https://like.do

### ✨ LikeDo 新增功能

- **短链增强**：AI 智能补全短链信息、支持创建专属私有子域名
- **邮箱升级**：AI 智能回复邮件、自动生成邮件模板、独立设置转发地址
- 更完善的用户交互体验

### 📦 数据迁移指南

如果您在 WR.DO 创建过资源，请按以下步骤迁移：

1. 在 [like.do](https://like.do) 注册账户
2. 前往 [数据迁移页面](https://like.do/dashboard/migrate-wrdo) 填写历史数据信息
3. 系统将自动迁移您的短链和邮箱账户（不包括收件箱历史数据）

立即体验官方运营版 👉 [like.do](https://like.do)



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

> 注意，任何部署方式都需要先配置环境变量，若部署后修改了环境变量，需要**重新部署**才会生效。

### 使用 Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/oiov/wr.do.git&project-name=wrdo)

记得填写必要的环境变量。

### 使用 Docker Compose 部署

在服务器中创建一个文件夹，进入该文件夹并新建 [docker-compose.yml](https://github.com/oiov/wr.do/blob/main/docker-compose.yml)、[.env](https://github.com/oiov/wr.do/blob/main/.env.example) 文件：

```yml
- wrdo
  | - docker-compose.yml
  | - .env
```

在 `.env` 中填写必要的环境变量，然后执行: 

```bash
docker compose up -d
```

> 或只创建 docker-compose.yml 文件，环境变量直接填写在yml中，比如将`DATABASE_URL: ${DATABASE_URL}`替换成`DATABASE_URL: your-database-uri`

### 使用 EdgeOne 部署

> 此方法部署目前无法build成功，不建议使用

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2Foiov%2Fwr.do)

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
```

```bash
# 在 localhost:3000 上运行
pnpm dev
```

- 默认账号(管理员)：`admin@admin.com`
- 默认密码：`123456`

> 登录后请及时修改密码

#### 管理员初始化

> 此初始化引导在 v1.0.2 版本后, 不再是必要步骤

访问 https://localhost:3000/setup

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

- Discord: https://discord.gg/AHPQYuZu3m
- 微信群：

<img width="300" src="https://wr.do/group" />

## 贡献者

<a href="https://github.com/oiov/wr.do/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=oiov/wr.do" />
</a>

## 请作者喝咖啡
  
[爱发电主页打赏](wr.do/afdhome)

<img width="100" src="https://wr.do/bbpt9z?ref=https://github.com/oiov/wr.do" />


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




