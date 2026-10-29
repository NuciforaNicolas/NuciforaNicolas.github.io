# nuciforanicolas.github.io

Personal portfolio of Nicolas Nucifora, System & AI Programmer.

Static site, no build step and no dependencies: plain HTML, one CSS file (`assets/css/site.css`) and one small script (`assets/js/site.js`, used by project pages for the video player and the image gallery).

## Structure

- `index.html`: home (about, experience, projects, contact)
- `AQuietPlace.html`, `Batora.html`, `Smartrehab.html`: project pages
- Project images for shipped games are official Steam store assets, loaded from the Steam CDN (capsule 616x353 for cards, screenshots 600x338 as thumbnails and 1920x1080 in the lightbox)
- `assets/img/projects/smartrehab/`: local images for Smart Rehab, which has no store page
- `assets/document/Nicolas_Nucifora_CV.pdf`: CV

## Languages

English text lives in the HTML. The Italian version of each element is in a `data-it` attribute on the same element (`data-it-label` and `data-it-alt` for `aria-label` and `alt`). `assets/js/site.js` swaps them when the EN/IT switch is used. When you change a text, update both. Elements with `data-it` must contain text only: wrap the text in a `<span>` if the element also contains links or icons.

## Adding a project

1. Copy one of the project pages and update texts (English and `data-it`), video id (`data-yt`) and gallery.
2. Use the official images from the game store page (Steam: `store.steampowered.com/api/appdetails?appids=<id>`), or add local JPEGs (max 1600px wide) to `assets/img/projects/<project>/`.
3. Add a `.card` in the `#projects` section of `index.html`.

## Local preview

Open `index.html` in a browser, or run any static server from the repository root.
