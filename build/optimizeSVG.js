import cliProgress from "cli-progress"
import kanjivgIndex from "../kanjivg/kvg-index.json"
import svgo from "svgo"

const kanjivgPath = "./kanjivg/kanji"
const outputPath = "./public/k"
const indexOutput = "./public/kg-index.json"

const reducedIndex = Object.fromEntries(
  Object.entries(kanjivgIndex).map(([char, files]) => {
    const file = files.findLast((name) => !name.includes("-")) || files.at(-1)
    return [char, file]
  })
)

const filenames = Object.values(reducedIndex)
const bar = new cliProgress.SingleBar({
  etaBuffer: 300,
})

console.log("Optimizing SVG files:")
bar.start(filenames.length)
for (const filename of filenames) {
  await proccessFile(filename)
  bar.increment()
}
bar.stop()

console.log(`Saving index in ${indexOutput}`)
Bun.write(indexOutput, JSON.stringify(reducedIndex))
console.log("Process finished.")

async function proccessFile(filename) {
  const file = Bun.file(`${kanjivgPath}/${filename}`)
  const originalSVG = (await file.text())
    // remove kvg: namespaced attributes wich breaks svgo parser
    .replace(/\s*kvg:\w+="[^"]*"/g, "")

    // use classes intead of ids for the Paths and Numbers groups
    .replace(/id="kvg:Stroke(Paths|Numbers)\w*"/g, `class="kg$1"`)

  const optimizedSVG = svgo.optimize(originalSVG, {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            convertColors: false,
            removeViewBox: false,
            mergePaths: false,
          },
        },
      },
      "removeDimensions",
      {
        name: "addClassesToSVGElement",
        params: {
          className: "kan-g",
        },
      },
      "convertStyleToAttrs",
      {
        name: "convertColors",
        params: {
          currentColor: "#000",
          names2hex: true,
          rgb2hex: true,
          shorthex: true,
          shortname: true,
        },
      },
    ],
  })

  await Bun.write(`${outputPath}/${filename}`, optimizedSVG.data)
}
