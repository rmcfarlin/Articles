# Articles

Published articles by Robert McFarlin, written in NEO.

The site is built with [Jekyll](https://jekyllrb.com) and served by GitHub Pages at
**https://robertmcfarlin.com/Articles/**.

## Publishing an article

1. Add a Markdown file to `_posts/` named `YYYY-MM-DD-short-title.md`.
2. Start it with front matter:

   ```yaml
   ---
   title: The title of the article
   description: One or two sentences shown on the article card and in search results.
   tags: [finance, operations]
   image: /assets/images/cover.jpg   # optional cover image
   image_alt: What the image shows   # optional
   ---
   ```

3. Write the article in Markdown below the front matter.
4. Commit and push to `main`. GitHub Pages rebuilds the site in a minute or two.

The article's URL is `/articles/short-title/`. Tags drive the **Topics** page and the
filter on the home page. `_drafts/formatting-reference.md` shows every formatting option;
anything in `_drafts/` is never published.

## Editing the site

| What                          | Where                     |
|-------------------------------|---------------------------|
| Name, bio, home headline, URL | `_config.yml`             |
| Header and footer links       | `_data/navigation.yml`    |
| About page                    | `about.md`                |
| Colors, type, layout          | `assets/css/main.css`     |

## GitHub Pages

Pages deploys from the `main` branch, `/ (root)` folder (**Settings → Pages**). Because the
account has a custom domain, the site is served at `robertmcfarlin.com/Articles/`.

## Previewing locally (optional)

Requires Ruby 3.x:

```sh
bundle install
bundle exec jekyll serve --livereload --drafts
```

Then open http://localhost:4000/Articles/.
