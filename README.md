# Shorts Publisher Backend

NestJS API for publishing authorized media to a connected YouTube channel.

## Setup
1. Create a Google Cloud OAuth 2.0 Web application.
2. Enable YouTube Data API v3.
3. Put credentials in .env.
4. Set ALLOWED_SOURCE_HOSTS to a host you control or are authorized to download from.
5. npm install && npm run start:dev.
6. Open GET /auth/google in a browser and authorize YouTube upload.

The API deliberately does not download arbitrary YouTube URLs. Only explicitly allowlisted HTTPS media hosts are accepted. Uploads default to private visibility.