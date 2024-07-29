<div align="center">
  <h1>𝐖𝐑.𝐃𝐎</h1>
  <p><a href="https://discord.gg/d68kWCBDEs">Discord</a> · English | <a href="/README.md">简体中文</a></p>
  <p>Temporary email service build with email worker.</p>
  <!-- <img src="https://img.inke.app/file/beb0212f96c6cd37eaeb8.jpg"/> -->
</div>

## Features

- 🎯 Privacy-friendly, no registration required, out-of-the-box
- ✈️ Support email sending and receiving
- ✨ Support saving passwords and retrieving email addresses
- 😄 Support multiple domain name suffixes
- 🚀 100% open source, quick deployment, no server required

Principles： 

- Receiving emails (email worker)
- Display email (remix)
- Mail Storage (sqlite)
- [Nodejs](https://nodejs.org) >= 18

> Worker receives email -> saves to database -> client queries email

## Self-hosted Tutorial

### Requirements

- [Cloudflare](https://dash.cloudflare.com/) account and a domain name hosted on Cloudflare
- [turso](https://turso.tech) sqlite (a free plan available for personal use)
- [Vercel](https://vercel.com) or [fly.io](https://fly.io) to deploy Remix app

### Receiving Emails steps

See [receive-tutorial-en.md](/docs//receive-tutorial-en.md)

### Sending Emails steps

See [send-tutorial-en.md](/docs/send-tutorial-en.md)

## Local development

copy `apps/remix/.env.example` to `apps/remix/.env` and fill in the necessary environment variables.

```bash
git clone https://github.com/oiov/vmail
cd vmail
pnpm install

# run on localhost:3000
pnpm run remix:dev
```

## Community Group

- Discord: https://discord.gg/d68kWCBDEs

## License

GNU General Public License v3.0

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=oiov/vmail&type=Date)](https://star-history.com/#oiov/vmail&Date)

Inspired by smail.pw & email.ml