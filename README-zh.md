<div align="center">
  <h1>WR.DO</h1>
  <p><a href="https://discord.gg/d68kWCBDEs">Discord</a> · English | <a href="/README-zh.md">简体中文</a></p>
  <p>创建 DNS 记录，生成短链接</p>
  <img src="https://wr.do/_static/images/light-preview.png"/>
</div>

## 功能

- 🌐 **多租户支持：** 无缝管理多个 DNS 记录
- ⚡ **即时记录创建：** 快速设置 CNAME 和 A 记录
- 🔗 **URL 缩短：** 轻松生成短链接
- 💻 **用户友好界面：** 直观且易于导航
- 🔒 **安全可靠：** 构建于 Cloudflare 强大的 DNS API 上
- 💰 **免费注册：** 创建和管理记录无需费用
- 🔄 **实时更新：** DNS 变化即时传播
- 🚀 **开源：** 完全透明，可定制的代码库

## 快速开始

查看有关[快速开始](https://wr.do/docs/quick-start)的文档。

## 自托管教程

### 要求

- [Vercel](https://vercel.com) 账户用于部署应用
- [Cloudflare](https://dash.cloudflare.com/) 账户  
- 在 Cloudflare 托管的 **域名**

查看有关[开发者](https://wr.do/docs/developer/installation)的文档。

## 本地开发

将 `.env.example` 复制为 `.env` 并填写必要的环境变量。

```bash
git clone https://github.com/oiov/wr.do
cd wr.do
pnpm install
# 生成数据库 schemas
pnpm postinstall 
# 部署数据库
pnpm db:push

# 在 localhost:3000 上运行
pnpm dev
```

## 社区群组

- Discord: https://discord.gg/d68kWCBDEs

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