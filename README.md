# Shorts Publisher Backend

NestJS API for publishing authorized media to one configured YouTube channel.

## YouTube authentication

This backend uses a single YouTube OAuth 2.0 refresh token stored in the server environment. There is no `/auth/google` endpoint and the refresh token is never sent to the frontend.

Set these environment variables:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `YOUTUBE_REFRESH_TOKEN`

The refresh token must have YouTube upload permission. Google uses it to obtain short-lived access tokens automatically when the backend uploads a video.

## Setup

1. Enable YouTube Data API v3 in Google Cloud.
2. Create OAuth 2.0 credentials.
3. Obtain a refresh token for the YouTube channel you own/control.
4. Add the three credentials above to Vercel Environment Variables.
5. Set `ALLOWED_SOURCE_HOSTS` to a host you control or are authorized to download from.
6. Deploy with `npm install && npm run build`.

The API deliberately does not download arbitrary YouTube URLs. Only explicitly allowlisted HTTPS media hosts are accepted. Uploads default to private visibility.

## Endpoints

### GET /auth/google/status

Removed. Authentication is configured server-side through `YOUTUBE_REFRESH_TOKEN`.

### POST /publish

Body:

```json
{
  "sourceUrl": "https://your-authorized-host.example/video.mp4",
  "title": "My Short",
  "description": "Description",
  "tags": ["shorts", "video"]
}
```

The backend downloads the authorized media, uploads it to the configured YouTube channel, and returns the YouTube video ID.
