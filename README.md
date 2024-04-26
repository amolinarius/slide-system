# Slide system

> [!WARNING]
> All slides are generated from [page hash](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash).  
> The user input is **not sanitized <ins>AT ALL</ins>**, which can lead to [XSS Attacks](https://en.wikipedia.org/wiki/Cross-site_scripting).  
> I'm not responsible for any misuse of this tool.

## 1. Features

- [ ] Sanitized user input
- [x] Advanced slides detection (in url hash)
- [X] Customizable window title
- [X] Navigation between different slides (using `space`, `Shift + space` and keyboard arrows)
- [ ] In-app editor

## 2. Functioning

### Tech stack

- Style made with [TailwindCSS](https://tailwindcss.com/)
- Markdown to HTML made with [Showdown.js](https://showdownjs.com)
- Syntax highlighting made with [Highlight.js](https://highlightjs.org)

### Hash functionment

The URL hash is a base64-encoded JSON object. It can be :  

- A string (containing a slide content)
- An array (containing multiple slides content)
- An object with properties `title` (not required, specifies the window title) and `pages` (string or array, as written above)

As for now, there aren't any editor included, but you can generate a hash using something like the following :
