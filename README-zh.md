<div align="center">
  <h1>WR.DO</h1>
  <p>
    <a href="https://wr.do/docs/developer">开发文档</a> · <a href="https://wr.do/feedback">Feedback</a> · <a href="/README.md">English</a> | 简体中文
  </p>
  <img alt="GitHub Release" src="https://img.shields.io/github/v/release/oiov/wr.do?style=flat-square">
  <img src="https://img.shields.io/github/stars/oiov/wr.do.svg?logo=github&style=flat-square" alt="star"/>
  <img alt="GitHub forks" src="https://img.shields.io/github/forks/oiov/wr.do?style=flat-square">
  <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/oiov/wr.do?style=flat-square"> <br>
  <img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/oiov/wr.do/docker-build-push.yml?style=flat-square">
	<img src="https://img.shields.io/github/license/oiov/wr.do?style=flat-square" alt="MIT"/>
</div>

## 简介

WR.DO 是一个一站式网络工具平台，集成短链服务、临时邮箱、子域名管理、文件存储和开放API接口。支持自定义链接、密码保护、访问统计；提供无限制临时邮箱收发；管理多域名DNS记录；支持云存储，对接 S3 API；内置网站截图、元数据提取等实用API。完整的管理后台，支持用户权限控制和服务配置。

- 官网: [https://wr.do](https://wr.do)
- Demo: [https://699399.xyz](https://699399.xyz) (账号: `admin@admin.com`, 密码: `123456`)

## 功能列表

- 🔗 **短链服务**：
  - 支持自定义短链
  - 支持生成自定义二维码
  - 支持密码保护链接
  - 支持设置过期时间
  - 支持访问统计（实时日志、地图等多维度数据分析）
  - 支持调用 API 创建短链

- 📮 **临时邮箱服务**：
  - 支持创建自定义前缀邮箱
  - 支持过滤未读邮件列表
  - 可创建无限数量邮箱
  - 支持接收无限制邮件 （依赖 Cloudflare Email Worker）
  - 支持发送邮件（依赖 Resend）
  - 支持 Catch-All 配置
  - 支持 Telegram 推送（多频道/群组）
  - 支持调用 API 创建邮箱
  - 支持调用 API 获取收件箱邮件
  - 
- 🌐 **子域名管理服务**：
  - 支持管理多 Cloudflare 账户下的多个域名的 DNS 记录
  - 支持创建多种 DNS 记录类型（CNAME、A、TXT 等）
  - 支持开启申请模式（用户提交、管理员审批）
  - 支持邮件通知管理员、用户域名申请状态

- 💳 **云存储服务**
  - 接入多渠道（S3 API）云存储平台（Cloudflare R2、AWS S3）
  - 支持单渠道多存储桶配置
  - 动态配置（用户配额设置）文件上传大小限制
  - 支持拖拽、批量、分块上传文件
  - 支持批量删除文件
  - 快捷生成文件短链、二维码
  - 支持部分文件在线预览内容
  - 支持调用 API 上传文件

- 📡 **开放接口模块**：
  - 获取网站元数据 API
  - 获取网站截图 API
  - 生成网站二维码 API
  - 将网站转换为 Markdown、Text
  - 支持所有类型 API 调用统计日志
  - 支持生成用户 API Key，用于第三方调用开放接口
  
- 🔒 **管理员模块**：
  - 多维度图表展示网站状态
  - 域名服务配置（动态配置各项服务是否启用，包括短链、临时邮箱（收发邮件）、子域名管理）
  - 用户列表管理（设置权限、分配使用额度、禁用用户等）
  - 动态配置登录方式 (支持 Google, GitHub, 邮箱验证, 账户密码, LinuxDO)
  - 短链管理（管理所有用户创建的短链）
  - 邮箱管理（管理所有用户创建的临时邮箱）
  - 子域名管理（管理所有用户创建的子域名）

## 截图预览

<table>
  <tr>
    <td><img src="https://wr.do/_static/images/light-preview.png" /></td>
    <td><img src="https://wr.do/_static/images/example_02.png" /></td>
  </tr>
  <tr>
    <td><img src="https://wr.do/_static/images/example_01.png" /></td>
    <td><img src="https://wr.do/_static/images/realtime-globe.png" /></td>
  </tr>
  <tr>
    <td><img src="https://wr.do/_static/images/example_03.png" /></td>
    <td><img src="https://wr.do/_static/images/domains.png" /></td>
  </tr>
</table>

## 快速开始

查看开发者[快速开始](https://wr.do/docs/developer/quick-start)详细文档。

## 自部署教程

### 使用 Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/oiov/wr.do.git&project-name=wrdo)

记得填写必要的环境变量。

### 使用 Docker Compose 部署

在服务器中创建一个文件夹，进入该文件夹并新建`docker-compose.yml`文件，填写必要的环境变量，然后执行：

```bash
docker compose up -d
```

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

查看 [开发者文档](https://wr.do/docs/developer).

## 技术栈

- Next.js + React + TypeScript
- Tailwind CSS 用于样式设计
- Prisma ORM 作为数据库工具
- Cloudflare 作为主要的云基础设施
- Vercel 作为推荐的部署平台
- Resend 作为邮件服务

## Fork 仓库同步

本项目配置了与上游仓库 [oiov/wr.do](https://github.com/oiov/wr.do) 的同步工作流，支持：

- 🔄 **手动触发同步** - 默认关闭自动同步，完全控制同步时机
- 💬 **同步后自动评论** - 在相关 commit 上添加详细的同步信息
- 🚨 **智能错误处理** - 同步失败时自动创建详细的 Issue
- 🧹 **自动清理通知** - 自动关闭之前的同步失败 Issue

前往[如何手动触发同步](https://wr.do/docs/developer/sync)查看详细文档。

## 社区群组

- Discord: https://discord.gg/AHPQYuZu3m
- 微信群：

<img width="300" src="https://wr.do/s/group" />

## 许可证

[MIT](/LICENSE.md)

## Star History

<a href="https://star-history.com/#oiov/wr.do&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=oiov/wr.do&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=oiov/wr.do&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=oiov/wr.do&type=Date" />
 </picture>
</a>
