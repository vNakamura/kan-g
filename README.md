# ![Logo](http://kan-g.vnaka.dev/kan-gLogo.svg)<br/><ruby>Kan<rt>かん</rt></ruby>-<ruby>G<rt>ジー</rt></ruby>

[KanjiVG](https://kanjivg.tagaini.net), streamlined.

## Table of Contents

- [Background](#background)
- [Differences](#differences)
- [Usage](#usage)
  - [Kan-G as external source](#kan-g-as-external-source)
- [Build your own version](#build-your-own-version)
- [License](#license)

---

## Background

This project started when I was creating a [userscript for jpdb.io](https://gist.github.com/vNakamura/90cd3dec43118d14d90df2323bdd2650) and needed to replace jpdb SVGs with the KanjiVG ones.

KanjiVG files are [full of features](https://kanjivg.tagaini.net/svg-format.html) that are useful for many projects. But these features also make the files bigger and takes more effort to customize how they look.

This is what Kan-G purposes: make it faster and easier to use for those who just need to show the kanji stroke order.

## Differences

Kan-G is not intended to make KanjiVG better, just simpler. Those changes might not be appropriate for some use cases. Here's a list of differences so you can decide if you should use Kan-G or stick to KanjiVG:

- **No variants**: For each character, a single file is available.
- **No custom attributes**: Strokes are not grouped by element and all `kvg:` attributes are removed.
- **Dark mode compatible**: Stroke colors are replaced from `#000000` (black) to `currentcolor`, which will inherit the text color from the parent element. The numbers are kept gray as it should be visible in most cases, but it's easily customizable with CSS (see bellow)
- **No `style=""` attribute**: Inline style properties are moved to SVG attributes, making it easier to override via CSS.
- **Simplified group naming**: StrokePaths and StrokeNumbers groups have a `class` instead of an `id` and doesn't include the unicode hexadecimal.
  - `<g id="kvg:StrokePaths_09593" ` -> `<g class="kgPaths" `
  - `<g id="kvg:StrokeNumbers_09593" ` -> `<g class="kgNumbers" `
- **No fixed dimensions**: The `width` and `height` attributes are removed from the `<svg>` tag. Most browsers will try to render it as big as possible in their parent elements. You might want to set a `max-width` or something similar to avoid breaking your design.

## Usage

If you clone the repository, the SVG files are in `public/k/{code}.svg`

The files are also hosted by Cloudflare Pages and available through their CDN. You can get each file directly at: `https://kan-g.vnaka.dev/k/{code}.svg`

&nbsp;
The `{code}` part follows the file naming convention from KanjiVG:

> lower-case hexadecimal Unicode value of the kanji, padded to five characters with zeros

In Javascript, this is translated to:

```js
const kanji = "何"
const code = kanji.charCodeAt(0).toString(16).padStart(5, "0") // 04f55
```

&nbsp;

For convenience, the index pointing to each file is available in `public/kg-index.json` or `https://kan-g.vnaka.dev/kg-index.json`. The json file differs from the KanjiVG one as it points directly to the String with the file name instead of an Array:

```js
// KanjiVG:
{
  "字":[
    "05b57-Kaisho.svg",
    "05b57.svg"
  ],
}

// Kan-G:
{
  "字": "05b57.svg",
}
```

&nbsp;

Even easier, you can point to `https://kan-g.vnaka.dev/c/{kanji}` and it will redirect to the proper file.
E.g.: `https://kan-g.vnaka.dev/c/方` will redirect to `https://kan-g.vnaka.dev/k/065b9.svg`

This will work for all characters available in KanjiVG with the exception of a few ASCII characters like `?` and `:` that are used for composing urls. If you plan to use those characters or want to be extra cautious, you can use [encodeURIComponent()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) to make it URL-safe.

> ⚠️ Please be aware that while the distribution of static files is unlimited in the Cloudflare free plan, the use of Function Workers is [limited](https://developers.cloudflare.com/workers/platform/limits/#worker-limits). If your project operates on high volume, consider implementing your own solution to avoid breaking the tool to everyone else.

### Kan-G as external source

If you cannot host you own files, the easiest way to use the kanji files in your site is with the `img` tag. But it has it's drawbacks.

`<img src="https://kan-g.vnaka.dev/c/字" width="250">` will result in this: <br>
<img src="https://kan-g.vnaka.dev/c/字" width="250">

The image looks correct and crisp in any size, but you cannot customize it with CSS. The `currentcolor` also won't take effect and the browser will just use black - If you're seeing this in dark mode, you already noticed.

One alternative is to use a script like [SVG Loader](https://github.com/shubhamjain/svg-loader)<br>
Here's a demo comparing how kanjis loaded with `img` and `svg-loader` are affected by CSS: <https://codepen.io/vNakamura/pen/GRzdxrb>

## Build your own version

1. First, make sure to include the submodules when cloning the project:

   1. `git clone --recurse-submodules git@github.com:vNakamura/kan-g.git`
   2. This way it will also download the original KanjiVG files.

2. Install [Bun](https://bun.sh/)
3. Install the project dependencies:

   1. `bun install`

4. Modify [./build/optimizeSVG.js](./build/optimizeSVG.js) for your needs. This script uses [SVGO](https://svgo.dev/) to modify the SVG files.
5. Run the script

   1. `bun run buildSVG`

## License

 <p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><span property="dct:title">Kan-G</span> by <span property="cc:attributionName">vNakamura</span> is licensed under <a href="http://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-SA 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"></a></p>

This is an adaptive work based on [KanjiVG](https://kanjivg.tagaini.net):

<blockquote>KanjiVG is copyright © 2009-2023 Ulrich Apel. It is released under the <a href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-Share Alike 3.0</a> license.<br />
<a href="https://creativecommons.org/licenses/by-sa/3.0/"><img src="https://i.creativecommons.org/l/by-sa/3.0/88x31.png" alt="" title=""></a>
</blockquote>
