# Danish Hakim — Portfolio

Live at https://www.danplace.tech (and https://jerit3787.github.io).

This is a **config-driven static site**. You edit plain JSON files describing
your content, run one build command, and the site regenerates itself as static
HTML. It's built with [Eleventy](https://www.11ty.dev/) (static site generator)
and [Tailwind CSS](https://tailwindcss.com/) (styling).

> **You almost never need to touch HTML.** To change what the site says, edit
> the JSON files in `src/_data/`.

## Editing content (the easy part)

All content lives in `src/_data/`. Each file maps to a part of the site:

| File | Controls |
| --- | --- |
| `site.json` | Name, meta/SEO tags, top navigation, social links, footer |
| `profile.json` | Hero (typing roles, tagline, buttons) and the About section |
| `skills.json` | Skill cards and progress bars |
| `experience.json` | Experience & Activities, grouped by category |
| `projects.json` | Projects, grouped by category |
| `ctf.json` | CTF Writeups cards on the home page |
| `achievements.json` | Achievements (home page shows the ones marked `"featured": true`; the `/achievements/` page shows all of them) |

### Common edits

- **Add a project:** open `src/_data/projects.json`, copy an existing item in
  the relevant category, and change the fields (`image`, `title`, `subtitle`,
  `description`, `bullets`, `links`, `chips`).
- **Add an achievement:** add an item to a section in
  `src/_data/achievements.json`. Give it an `"image"` (put the file in
  `assets/img/`) **or** an `"icon"` (any [Font Awesome](https://fontawesome.com/icons)
  name like `fa-trophy`). Add `"featured": true` to also show it on the home page.
- **Change a skill percentage:** edit the `level` (0–100) in `src/_data/skills.json`.
- **Change the typing roles in the hero:** edit `profile.hero.roles`.
- **Update nav / socials / footer links:** edit `src/_data/site.json`.

Images go in `assets/img/` and are referenced as `/assets/img/yourfile.png`.

After editing, run `npm run build` (or keep `npm run dev` running, see below).

## Local development

```bash
npm install        # first time only
npm run dev        # build + live-reload server at http://localhost:8080
```

`npm run dev` watches both the content/templates (Eleventy) and the styles
(Tailwind) and reloads the browser automatically.

To produce a one-off production build into `_site/`:

```bash
npm run build
```

## Deployment

Pushing to `main` triggers `.github/workflows/static.yml`, which runs
`npm ci && npm run build` and publishes the generated `_site/` folder to GitHub
Pages. You do **not** commit `_site/` — it's generated (and git-ignored).

## Project structure

```
src/
  _data/            # ← your content (JSON config files)
  _includes/
    layouts/base.njk # page shell: <head>, nav, footer, scripts
    macros/ui.njk    # reusable card / chip / button components
  index.njk          # home page (assembles all sections from _data)
  achievements.njk   # /achievements/ page
  styles/main.css    # Tailwind entry + custom CSS (image modal, animations)
  js/main.js         # typewriter, theme toggle, mobile nav, image modal, reveals
assets/img/          # images (passed through to the build)
eleventy.config.js   # Eleventy config (input src/, output _site/)
tailwind.config.js   # theme colors, fonts, shadows
```

## Changing the look

- **Colors, fonts, shadows:** `tailwind.config.js` (`theme.extend`).
- **Layout / markup of a section:** `src/index.njk` (or the shared card markup
  in `src/_includes/macros/ui.njk`).
- **Global page chrome (nav, footer):** `src/_includes/layouts/base.njk`.
