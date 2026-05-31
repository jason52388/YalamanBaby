# Minimal image for the dependency-free photo upload service.
# The script is BAKED IN (not bind-mounted) because the deploy host runs
# containers from a path without the repo files — same reason the web image
# bakes in the built site and Caddyfile.
FROM node:20-alpine
WORKDIR /app
COPY upload.mjs ./
EXPOSE 8080
CMD ["node", "upload.mjs"]
