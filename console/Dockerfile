# ---- Build Stage ----
FROM node:18.15.0-alpine as builder

# Set the working directory in the container to /console
WORKDIR /console

# Create the pnpm directory and set the PNPM_HOME environment variable
RUN mkdir -p ~/.pnpm
ENV PNPM_HOME=/root/.pnpm

# Set environment
ARG ENVIRONMENT=production
ARG DISABLE_EXTENSION_GENERATION=true
ENV DISABLE_EXTENSION_GENERATION=$DISABLE_EXTENSION_GENERATION

# Add the pnpm global bin to the PATH
ENV PATH=/root/.pnpm/bin:$PATH

# Increase Node heap for the Ember production build
ENV NODE_OPTIONS=--max-old-space-size=4096

# Copy pnpm-lock.yaml (or package.json) into the directory /console in the container
COPY package.json pnpm-lock.yaml ./

# Copy over .npmrc if applicable
COPY .npmr[c] ./

# Install global dependencies
RUN npm install -g ember-cli pnpm 

# Install git
RUN apk update && apk add git openssh-client

# Trust GitHub's RSA host key
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts

# Copy the postinstall script before installing dependencies
COPY scripts/patch-ember-ui-intl-tel-input.js ./scripts/patch-ember-ui-intl-tel-input.js

# Copy local library packages needed by pnpm workspace/file dependencies
COPY lib/ ./lib/

# Install app dependencies
RUN pnpm install

# Copy the console directory contents into the container at /console
COPY . .

# Build the application
RUN pnpm build --environment $ENVIRONMENT

# ---- Serve Stage ----
FROM nginx:alpine

# Copy the built app to our served directory
COPY --from=builder /console/dist /usr/share/nginx/html

# Expose the port nginx is bound to
EXPOSE 4200

# Use custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
