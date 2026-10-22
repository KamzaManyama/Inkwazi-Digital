# Inkwazi Digital Website

Static website for Inkwazi Digital, built with HTML, CSS, and JavaScript.

## Pages

- `index.html` is the home page.
- `about.html` is the about page.

## Local preview

Open `index.html` in a browser, or serve the project directory locally:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Project files

- `assets/css/styles.css` contains the site styles.
- `assets/js/main.js` contains the site JavaScript.
- `assets/` contains images and other site assets.

The site has no build step. When publishing, deploy the HTML files and the full
`assets/` directory together. Asset paths and filename capitalization must
match exactly; live Linux hosting is case-sensitive. For example, the founder
background is `assets/owner-Image.jpg`.