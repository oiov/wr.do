<div align="center">
  <h1>WR.DO</h1>
  <p><a href="https://wr.do/docs/developer">Docs</a> · <a href="https://wr.do/feedback">Feedback</a> · English | <a href="/README-zh.md">简体中文</a></p>
  <img alt="GitHub Release" src="https://img.shields.io/github/v/release/oiov/wr.do?style=flat-square">
  <img src="https://img.shields.io/github/stars/oiov/wr.do.svg?logo=github&style=flat-square" alt="star"/>
  <img alt="GitHub forks" src="https://img.shields.io/github/forks/oiov/wr.do?style=flat-square">
  <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/oiov/wr.do?style=flat-square"> <br>
  <img alt="GitHub Actions Workflow Status" src="https://img.shields.io/github/actions/workflow/status/oiov/wr.do/docker-build-push.yml?style=flat-square">
	<img src="https://img.shields.io/github/license/oiov/wr.do?style=flat-square" alt="MIT"/>
</div>

## Introduction

WR.DO is a all-in-one web utility platform featuring short links with analytics, temporary email service, subdomain management, file storage, open APIs for screenshots and metadata extraction, and comprehensive admin dashboard.

- Official website: [https://wr.do](https://wr.do)
- Demo: [https://699399.xyz](https://699399.xyz) (Account: `admin@admin.com`, Password: `123456`)

## Features

- 🔗 **Short Link Service**:
  - Custom short links
  - Generate custom QR codes
  - Password-protected links
  - Expiration time control
  - Access analytics (real-time logs, maps, and multi-dimensional data analysis)
  - API integration for link creation

- 📮 **Email Service**:
  - Create custom prefix emails
  - Filter unread email lists
  - Unlimited mailbox creation
  - Receive unlimited emails (powered by Cloudflare Email Worker)
  - Send emails (powered by Resend)
  - Support catch-all emails
  - Support push to telegram groups
  - API endpoints for mailbox creation
  - API endpoints for inbox retrieval

- 🌐 **Subdomain Management Service**:
  - Manage DNS records across multiple Cloudflare accounts and domains
  - Create various DNS record types (CNAME, A, TXT, etc.)
  - Support enabling application mode (user submission, admin approval)
  - Support email notification of administrator and user domain application status

- 💳 **Cloud Storage Service**
  - Connects to multiple channels (S3 API) cloud storage platforms (Cloudflare R2, AWS S3)
  - Supports single-channel multi-bucket configuration
  - Dynamic configuration (user quota settings) for file upload size limits
  - Supports drag-and-drop, batch, and chunked file uploads
  - Supports batch file deletion
  - Quickly generates short links and QR codes for files
  - Supports online preview of certain file types
  - Supports file uploads via API calls

- 📡 **Open API Module**:
  - Website metadata extraction API
  - Website screenshot capture API
  - Website QR code generation API
  - Convert websites to Markdown/Text format
  - Comprehensive API call logging and statistics
  - User API key generation for third-party integrations
  
- 🔒 **Administrator Module**:
  - Multi-dimensional dashboard with website analytics
  - Dynamic service configuration (toggle short links, email, subdomain management)
  - User management (permissions, quotas, account control)
  - Dynamically configure login methods (Google, GitHub, Magic Link, Credentials, LinuxDO)
  - Centralized short link administration
  - Centralized email management
  - Centralized subdomain administration

## Screenshots

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


## Quick Start

See step by step installation tutorial at [Quick Start for Developer](https://wr.do/docs/developer/quick-start).

## Self-hosted

### Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/oiov/wr.do.git&project-name=wrdo)

Remember to fill in the necessary environment variables.

### Deploy with Docker Compose

Create a new folder and copy the [`docker-compose.yml`](https://github.com/oiov/wr.do/blob/main/docker-compose.yml)、[`.env`](https://github.com/oiov/wr.do/blob/main/.env.example) file to the folder.

```yml
- wrdo
  | - docker-compose.yml
  | - .env
```

Fill in the environment variables in the `.env` file, then: 

```bash
docker compose up -d
```

## Local development

```bash
git clone https://github.com/oiov/wr.do
cd wr.do
pnpm install
```

copy `.env.example` to `.env` and fill in the necessary environment variables.

#### Init database

```bash
pnpm postinstall
pnpm db:push
```

```bash
# run on localhost:3000
pnpm dev
```

- Default admin account：`admin@admin.com`
- Default admin password：`123456`

#### Setup Admin Panel

> After v1.0.2, this setup guide is not needed anymore

Follow https://localhost:3000/setup

## Deploy with Edgeone

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?repository-url=https%3A%2F%2Fgithub.com%2Foiov%2Fwr.do)

## Environment Variables

Via [Installation For Developer](https://wr.do/docs/developer).

## Technology Stack

- Next.js + React + TypeScript
- Tailwind CSS for styling and design
- Prisma ORM as the database toolkit
- Cloudflare as the primary cloud infrastructure
- Vercel as the recommended deployment platform
- Resend as the primary email service

## Fork Repository Sync

This project is configured with a sync workflow for the upstream repository [oiov/wr.do](https://github.com/oiov/wr.do), featuring:

- 🔄 **Manual Sync Trigger** - Auto-sync disabled by default, full control over sync timing
- 💬 **Auto Comment After Sync** - Add detailed sync information to related commits
- 🚨 **Smart Error Handling** - Auto-create detailed Issues when sync fails
- 🧹 **Auto Cleanup Notifications** - Automatically close previous sync failure Issues

See [How to Trigger Sync](https://wr.do/docs/developer/sync) for details.

## Community Group

- Discord: https://discord.gg/AHPQYuZu3m
- 微信群：

<img width="300" src="https://wr.do/s/group" />

## License

[MIT](/LICENSE.md)

## Star History

<a href="https://star-history.com/#oiov/wr.do&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=oiov/wr.do&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=oiov/wr.do&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=oiov/wr.do&type=Date" />
 </picture>
</a>
