import cliProgress from 'cli-progress'
import kanjivgIndex from '../kanjivg/kvg-index.json'
import svgo from 'svgo'

const kanjivgPath = './kanjivg/kanji'
const outputPath = './public/k'

const filenames = Object.values(kanjivgIndex).flat()
const bar = new cliProgress.SingleBar({
  etaBuffer: 300
})
bar.start(filenames.length)
for(const filename of filenames) {
  await proccessFile(filename)
  bar.increment()
}
bar.stop()

async function proccessFile(filename) {
  const file = Bun.file(`${kanjivgPath}/${filename}`)
  const originalSVG = (await file.text())
      // remove kvg: namespaced attributes wich breaks svgo parser
    .replace(/\s*kvg:\w+="[^"]*"/g, "")

      // use classes intead of ids for the Paths and Numbers groups
    .replace(/id="kvg:Stroke(Paths|Numbers)\w*"/g, `class="kg$1"`)

  const optimizedSVG = svgo.optimize(originalSVG, {
    plugins: [
      'preset-default',
      {
        name: "addClassesToSVGElement",
        params: {
          className: "kan-g"
        }
      },
      "convertStyleToAttrs",
    ]
  })

  await Bun.write(`${outputPath}/${filename}`, optimizedSVG.data)
}
