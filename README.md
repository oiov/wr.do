<div align="center">
  <h1>WR.DO</h1>
  <p><a href="https://wr.do/docs/developer">Docs</a> · <a href="https://discord.gg/AHPQYuZu3m">Discord</a> · English | <a href="/README-zh.md">简体中文</a></p>
  <p>Make Short Links, Manage DNS Records, Receive Emails.</p>
</div>

## Introduction

WR.DO is a all-in-one web utility platform featuring short links with analytics, temporary email service, subdomain management, open APIs for screenshots and metadata extraction, plus comprehensive admin dashboard.

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
  - API endpoints for mailbox creation
  - API endpoints for inbox retrieval

- 🌐 **Subdomain Management Service**:
  - Manage DNS records across multiple Cloudflare accounts and domains
  - Create various DNS record types (CNAME, A, TXT, etc.)

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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/oiov/wr.do.git&project-name=wrdo&env=DATABASE_URL&env=AUTH_SECRET&env=RESEND_API_KEY&env=NEXT_PUBLIC_EMAIL_R2_DOMAIN&env=NEXT_PUBLIC_OPEN_SIGNUP&env=GITHUB_TOKEN)

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

```bash
# run on localhost:3000
pnpm dev
```

#### Init database

```bash
pnpm postinstall
pnpm db:push
```

#### Setup Admin Panel

Follow https://localhost:3000/setup

## Environment Variables

Via [Installation For Developer](https://wr.do/docs/developer).

## Technology Stack

- Next.js + React + TypeScript
- Tailwind CSS for styling and design
- Prisma ORM as the database toolkit
- Cloudflare as the primary cloud infrastructure
- Vercel as the recommended deployment platform

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

[![Powered by DartNode](https://dartnode.com/branding/DN-Open-Source-sm.png)](https://dartnode.com "Powered by DartNode - Free VPS for Open Source")
