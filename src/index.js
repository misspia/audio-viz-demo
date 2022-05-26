import * as THREE from "three"
import audioSrc from "./audio.mp3"
import { remapFreq } from "./utils"

/*****************************************************************************************************************************************************************
 * Setup
 *****************************************************************************************************************************************************************/

const audioElement = document.createElement("audio")
document.body.append(audioElement)
audioElement.src = audioSrc

const canvas = document.getElementById("canvas")

const audioContext = new AudioContext()
const source = audioContext.createMediaElementSource(audioElement)
const analyser = audioContext.createAnalyser();
const frequencyData = new Uint8Array(100);

source.connect(analyser)
source.connect(audioContext.destination)

audioElement.loop = true
audioElement.volume = 1
audioElement.play()


const scene = new THREE.Scene()
const aspectRatio = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(75, aspectRatio)
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  stencil: false,
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0xffdddd);
camera.position.set(10, 10, 10)
camera.lookAt(0, 0, 0)


/*****************************************************************************************************************************************************************
 * Create visualization elements
 *****************************************************************************************************************************************************************/

const bars = []
frequencyData.forEach(() => {
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const mesh = new THREE.Mesh(geometry, material)

  scene.add(mesh)
  bars.push(mesh)
})



/*****************************************************************************************************************************************************************
 * Render
 *****************************************************************************************************************************************************************/

const draw = () => {
  analyser.getByteFrequencyData(frequencyData);

  bars.forEach((bar, index) => {
    const freq = frequencyData[index]
    bar.scale.y = remapFreq(1, 2, freq)
  })  
  
  renderer.render(scene, camera)
  requestAnimationFrame(() => draw())
}






draw()
