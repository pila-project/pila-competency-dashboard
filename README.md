# PILA competence dashboard

This project uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Local dependencies

The vite config expects the [`mkcert`](https://github.com/FiloSottile/mkcert) tool to be available in `/usr/bin/mkcert`. On recent Ubuntu, it can be installed with:
```
sudo apt install mkcert libnss3-tools
mkcert -install
```

## Develop locally

Run `npm run dev`, open the local HTTPS URL printed by Vite, and use your existing `domain`, `user`, and `game` query parameters.

You need a running Candli dev server on `localhost:8080` to resolve games locally.

Add `&previewQualitative=1` to show sample qualitative feedback while keeping real quantitative scores.
Samples in `src/qualitativePreview.ts` match games by index; games beyond the samples have no qualitative feedback.
The flag only works on `localhost`, `127.0.0.1`, and IPv6 loopback (`[::1]`).
