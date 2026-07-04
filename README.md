# Mech Tech Engineering — Website

A static, single-page site for **Mech Tech Engineering (MTE)** — structural
fabrication, mechanical installation, machining, blasting & painting, and gas
piping & utility systems, based in Dadra, DNH.

No build step, no dependencies to install — it's plain HTML/CSS/JS plus
Three.js loaded from a CDN, so it runs anywhere static files can be served,
including **GitHub Pages**.

## What's inside

```
index.html                 the whole page
assets/css/style.css       all styling (design tokens at the top)
assets/js/main.js          nav + service tabs + the interactive hero rig
assets/img/                logo, business-card scan, and brochure photos
```

The hero has an interactive **3D gantry-crane rig** (built with Three.js) —
drag to rotate it, click anywhere on it to trigger a weld-spark burst. It's
built from the same brand colours as the logo (steel grey + gold + weld
orange) and automatically calms down if the visitor's OS has "reduce motion"
turned on.

## Replacing the founder's photo

Open `index.html`, find this block in the **Founder** section:

```html
<div class="founder-photo" id="founderPhoto">
  Add founder photo here
  <img src="" alt="Dipak C Pathak, Founder of Mech Tech Engineering" id="founderImg">
</div>
```

1. Drop the photo into `assets/img/` (e.g. `assets/img/founder.jpg`).
2. Set the `src` on the `<img>` tag: `src="assets/img/founder.jpg"`.

The placeholder text disappears automatically once the image loads — no CSS
or JS changes needed.

## Editing content

- **Colours, fonts, spacing** — all defined as CSS custom properties at the
  top of `assets/css/style.css` under `:root`.
- **Services tabs** — each tab/pane pair lives in `index.html` inside
  `#services`; add a new `<button class="svc-tab">` + matching
  `<div class="svc-pane">` to add a discipline.
- **Contact details / address / GST** — in the `#contact` section and the
  footer at the bottom of `index.html`.

## Running it locally

No build tools needed — just serve the folder:

```bash
# from inside this folder
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly via `file://` also mostly works, but some
browsers block ES module imports over `file://` — a local server avoids that.)

## Deploying to GitHub Pages

1. Create a new GitHub repository (or use an existing one) and push this
   folder's contents to the `main` branch:

   ```bash
   git init
   git add .
   git commit -m "Mech Tech Engineering website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. On GitHub: go to the repo's **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`.
4. Save. GitHub will publish the site at:

   ```
   https://<your-username>.github.io/<your-repo>/
   ```

   (First deploy can take a minute or two.)

5. **Custom domain (optional):** if you want it served from
   `www.mechtechengineering.co.in`, add that hostname under
   **Settings → Pages → Custom domain**, and add a `CNAME` record at your
   domain registrar pointing to `<your-username>.github.io`.

## Notes on the source material

Copy and photos were pulled from the brochure (`Mech_tech.docx` /
`Mech_tech_profile.pdf`), the new logo, and the new business card supplied
for this project. Contact details on the business card were treated as the
current, authoritative ones; the workshop address from the brochure is kept
as a separate "Workshop" entry since it differs slightly from the office
address on the card — double check both before publishing in case one is
now out of date.
