# Node dev container for Next.js with hot reload
FROM node:20-alpine

WORKDIR /app

# Install deps separately for better caching
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i; \
    else npm i; fi

COPY . .

EXPOSE 3000
CMD ["npm","run","dev"]
