# Ferran Vidal-Codina

Source for my personal portfolio and professional website.

Published at [ferranvidal.github.io](https://ferranvidal.github.io).

The site presents selected production AI, machine learning, sports analytics, and data-platform work. It is built with [al-folio](https://github.com/alshedivat/al-folio), Jekyll, and GitHub Pages.

## Local development

```bash
bundle install
npm ci
bundle exec jekyll serve
```

The local site is available at `http://localhost:4000`.

## Deployment

Pushing to `main` triggers the deployment workflow. The generated site is published from the `gh-pages` branch.
