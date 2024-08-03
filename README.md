<div align="center">
  <h1>WR.DO</h1>
  <p><a href="https://discord.gg/d68kWCBDEs">Discord</a> · English | <a href="/README-zh.md">简体中文</a></p>
  <p>Craft DNS Records, Make Short Links</p>
  <img src="https://wr.do/_static/images/light-preview.png"/>
</div>

## Features

- 🌐 **Multi-Tenant Support:** Manage multiple DNS records seamlessly
- ⚡ **Instant Record Creation:** Set up CNAME, A, and other records quickly
- 🔗 **URL Shortening:** Generate short links effortlessly
- 💻 **User-Friendly Interface:** Intuitive and easy to navigate
- 🔒 **Secure & Reliable:** Built on Cloudflare's robust DNS API
- 💰 **Free Registration:** No cost to create and manage records
- 🔄 **Real-Time Updates:** Instant propagation of DNS changes
- 🚀 **Open Source:** Fully transparent, customizable code base

## Quick Start

See docs about [guide](https://wr.do/docs/quick-start) for quick start.

## Self-hosted Tutorial

### Requirements

- [Vercel](https://vercel.com) to deploy app
- [Cloudflare](https://dash.cloudflare.com/) account  
- A **domain** name hosted on Cloudflare

See docs about [developer](https://wr.do/docs/developer/installation).

## Local development

copy `.env.example` to `.env` and fill in the necessary environment variables.

```bash
git clone https://github.com/oiov/wr.do
cd wr.do
pnpm install
# generate db schemas
pnpm postinstall 
# depoly db
pnpm db:push

# run on localhost:3000
pnpm dev
```

## Community Group

- Discord: https://discord.gg/d68kWCBDEs

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