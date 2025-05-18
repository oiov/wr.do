<div align="center">
  <h1>WR.DO</h1>
  <p><a href="https://discord.gg/AHPQYuZu3m">Discord</a> · English | <a href="/README-zh.md">简体中文</a></p>
  <p>生成短链接, 创建 DNS 记录, 管理临时邮箱</p>
  <!-- <img src="https://wr.do/_static/images/light-preview.png"/> -->
</div>

## 功能

- 🔗 **短链生成**：生成附有访问者统计信息的短链接 (支持密码保护, 支持调用 API)
- 📮 **临时邮箱**：创建多个临时邮箱接收和发送邮件（支持调用 API）
- 🌐 **多租户支持**：无缝管理多个 DNS 记录
- 📸 **截图 API**：访问截图 API、网站元数据抓取 API
- �😀 **权限管理**：方便审核的管理员面板
- 🔒 **安全可靠**：基于 Cloudflare 强大的 DNS API

## Screenshots

![screenshot](https://wr.do/_static/images/light-preview.png)

![screenshot](https://wr.do/_static/images/example_01.png)

![screenshot](https://wr.do/_static/images/example_02.png)

![screenshot](https://wr.do/_static/images/example_03.png)

## 快速开始

查看开发者[快速开始](https://wr.do/docs/developer/quick-start)的详细文档。

查看有关[快速开始](https://wr.do/docs/quick-start)的文档。

## 自托管教程

### 要求

- [Vercel](https://vercel.com) 账户用于部署应用
- 至少一个在 [Cloudflare](https://dash.cloudflare.com/) 托管的 **域名**

查看[开发文档](https://wr.do/docs/developer/installation)。

### Email worker

查看 [email worker](https://wr.do/docs/developer/cloudflare-email-worker) 文档用于邮件接收。

## 本地开发

将 `.env.example` 复制为 `.env` 并填写必要的环境变量。

```bash
git clone https://github.com/oiov/wr.do
cd wr.do
pnpm install

# 在 localhost:3000 上运行
pnpm dev
```

## 社区群组

- Discord: https://discord.gg/AHPQYuZu3m
- 微信群：

![](https://wr.do/s/group)

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