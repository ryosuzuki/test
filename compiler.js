import { OfflineCompiler } from 'mind-ar/src/image-target/offline-compiler.js'
import { writeFile } from 'fs/promises'
import { loadImage } from 'canvas'

const imagePaths = ['./public/example.png']

async function run() {
  //load all images
  const images = await Promise.all(imagePaths.map(value => loadImage(value)))
  const compiler = new OfflineCompiler()
  await compiler.compileImageTargets(images, console.log)
  const buffer = compiler.exportData()
  await writeFile('./public/example.mind', buffer)
}

run()