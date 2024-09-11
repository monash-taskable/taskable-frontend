Build and Deploying
===

### Updating Protobuf TypeScript Definitions

Protobuf TypeScript definitions (`.ts` files located under `@/types/proto`) are updated only when executing `pnpm run dev`, `pnpm run build` or `pnpm run buildproto`.

See [CommunicationAndProtobufs.md](/documentation/CommunicationAndProtobufs.md) for procedures on updating the protobufs.

### Deploy Config

Configuration in deployment is done using environment variables.

The following environment variables should be set

```env
GOOGLE_OAUTH_URL=<Google OAuth URL>
API_HOST=<API Host Name>
```

`API_HOST` should be something like `https://localhost:1234/`.