# 🚀 Deployment Guide

## Serverless Deployment (Рекомендовано)

### Vercel

Найпростіший спосіб задеплоїти Node.js застосунок з MongoDB та Auth0:

**📖 Повна інструкція:** [VERCEL.md](VERCEL.md)

```bash
# 1. Встановіть Vercel CLI
yarn global add vercel

# 2. Залогіньтесь
vercel login

# 3. Задеплойте
vercel --prod
```

**Особливості:**

- ✅ Автоматична lazy initialization для MongoDB
- ✅ Безкоштовний план для навчання
- ✅ Автоматичний deploy при push
- ✅ HTTPS out of the box
- ✅ Глобальний CDN

---

## Production Deployment (Традиційний сервер)

### Environment Variables

Create `.env` file:

```bash
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
```

**Alternative with npm:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### PM2 Process Manager

**With Yarn:**

```bash
# Install PM2
yarn global add pm2

# Start application
pm2 start index.mjs --name "products-api"

# Monitor
pm2 monit

# Logs
pm2 logs products-api
```

**With npm:**

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start index.mjs --name "products-api"

# Monitor
pm2 monit

# Logs
pm2 logs products-api
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Security Considerations

- Use HTTPS in production
- Implement rate limiting
- Add input sanitization
- Use environment variables for secrets
- Enable CORS properly
- Add authentication/authorization
