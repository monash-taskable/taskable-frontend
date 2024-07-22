Communication and Protobufs
===

### Managing Protobufs

Protobufs formats are defined in the `.proto` files located in `@/proto/`. This is the directory where you add or remove files for any used `.proto` files.

The TypeScript definitions for these `.proto` files including its encoder and decoder logic are built to `@/types/proto`. These are *Automatically generated files*, which means you shouldn't need to manually add or remove any file from the `@/types/proto` directory.

After adding and removing files in `@/proto/`, you can run `pnpm run protobuild` to build them into `@/types/proto/`. This command __*Deletes all `*.ts` contents located under `@/types/proto` and replaces with the newly built one*__.

When running `pnpm run build` or `pnpm run dev`, `pnpm run protobuild` is automatically invoked before the actual build or dev server, but when the server is built or dev server is running, the typescript definitions are not automatically updated when `.proto` files updates. When running dev server, after updating `.proto` files, run `pnpm run protobuild` manually, without restarting the dev server; when the production server is built, you have to run `pnpm run build` again after updating `.proto` files.

### Fetching and Requesting Remote HTTP Server

Use functions defined in `@/scripts/FetchTools.ts` for HTTP requests related, including sending, receiving, encoding and decoding messages.

See [api-references/FetchTools.ts.md](/documentation/api-references/FetchTools.ts.md) for API references of tools provided in `FetchTools.ts`.

### Manual Encoding and Decoding Protobuf Messages