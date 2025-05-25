<div align="center">
  <h1>WR.DO</h1>
  <p><a href="https://discord.gg/AHPQYuZu3m">Discord</a> · English | <a href="/README-zh.md">简体中文</a></p>
  <p>Make Short Links, Manage DNS Records, Email Support.</p>
  <!-- <img src="https://wr.do/_static/images/light-preview.png"/> -->
</div>

## Features

- 🔗 **URL Shortening:** Generate short links with visitor analytic and password(support api)
- 📮 **Email Support:** Receive emails and send emails(support api)
- 💬 **P2P Chat:** Start chat in seconds
- 🌐 **Multi-Tenant Support:** Manage multiple DNS records seamlessly
- 📸 **Screenshot API:** Access to screenshot api、website meta-info scraping api.
- 😀 **Permission Management:** A convenient admin panel for auditing
- 🔒 **Secure & Reliable:** Built on Cloudflare's robust DNS API

## Screenshots

![screenshot](https://wr.do/_static/images/light-preview.png)

![screenshot](https://wr.do/_static/images/example_02.png)

![screenshot](https://wr.do/_static/images/example_01.png)

![screenshot](https://wr.do/_static/images/example_03.png)

## Quick Start

See usage docs about [guide](https://wr.do/docs/quick-start) for quick start.

## Self-hosted Tutorial

See step by step installation tutorial at [Quick Start for Developer](https://wr.do/docs/developer/quick-start).

### Requirements

- [Vercel](https://vercel.com) to deploy app
- A **domain** name hosted on [Cloudflare](https://dash.cloudflare.com/)

See more docs about [developer](https://wr.do/docs/developer/installation).

### Email worker

See docs about [email worker](https://wr.do/docs/developer/cloudflare-email-worker).

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

### Start on Docker 

#### Dockerfile 

```bash
git clone https://github.com/oiov/wr.do
cd wr.do
```

Fill in the environment variables in the `Dockerfile`, then build and run.

```bash
# Build image
docker build -t wrdo .
# Run 
docker run -p 3000:3000 wrdo
```

#### Docker Compose

```bash
git clone https://github.com/oiov/wr.do
cd wr.do
```

Fill in the environment variables in the `env` file, then: 

```bash
docker compose up -d
```

## Legitimacy review

- To avoid abuse, applications without website content will be rejected
- To avoid domain name conflicts, please check before applying
- Completed website construction or released open source project (ready to build website for open source project)
- Political sensitivity, violence, pornography, link jumping, VPN, reverse proxy services, and other illegal or sensitive content must not appear on the website

**Administrators will conduct domain name checks periodically to clean up domain names that violate the above rules, have no content, and are not open source related**

## Community Group

- Discord: https://discord.gg/AHPQYuZu3m
- 微信群：

![](https://wr.do/s/group)

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