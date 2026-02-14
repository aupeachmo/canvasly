# Canvasly — Business Model Canvas

**https://aupeachmo.github.io/canvasly/**

An interactive, editable Business Model Canvas you can fill in and export as PDF.

## Deploy to GitHub Pages

Everything is automated. Just:

1. Push this repo to GitHub
2. Go to Settings → Pages → set source to `master` branch, `/docs` folder

Every push to `master` triggers a GitHub Action that builds the static files into `docs/` and commits them back. No manual build step needed.

If you rename the repo, update `BASE_PATH` in `.github/workflows/build.yml` to match (e.g. `/my-repo/`).

## Build locally with Docker

```bash
chmod +x build.sh
./build.sh /canvasly/
```

Outputs static files to `./docs/`.

## Local preview

```bash
docker build -t canvasly .
docker run -p 8080:80 canvasly
```

Then open http://localhost:8080/canvasly/

## Development (without Docker)

```bash
npm install
npm run dev
```
