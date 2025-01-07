FROM node:21

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build argument for environment
ARG BUILD_ENV=development
ENV BUILD_ENV=${BUILD_ENV}

# Build the application if in production
RUN if [ "$BUILD_ENV" = "production" ]; then pnpm build; fi

EXPOSE 3000

# Start the application based on environment
CMD if [ "$BUILD_ENV" = "production" ]; then \
      pnpm start; \
    else \
      pnpm install -r && pnpm dev; \
    fi
