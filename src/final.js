import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// import audioSrc from "./audio/audio-1.mp3"
import audioSrc from "./audio/audio-2.mp3"
// import audioSrc from "./audio/audio-3.mp3"
// import audioSrc from "./audio/audio-4.mp3"
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
const frequencyData = new Uint8Array(50);

source.connect(analyser)
source.connect(audioContext.destination)

audioElement.loop = true
audioElement.volume = 1.0
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

camera.position.set(15, 15, 15)
camera.lookAt(0, 0, 0)

const controls = new OrbitControls(camera, renderer.domElement)

/*****************************************************************************************************************************************************************
 * Add lights
 *****************************************************************************************************************************************************************/
const ambient = new THREE.AmbientLight(0xaaaaaa, 1)
scene.add(ambient)

const directional = new THREE.DirectionalLight(0xffffff, 1.0)
directional.position.set(0, 1, 0).normalize()
scene.add(directional)

const spot = new THREE.SpotLight(0xffffff, 3, 80, 0.5, 1)
spot.shadow.bias = -0.0001
spot.castShadow = true
spot.shadow.mapSize.width = 512;
spot.shadow.mapSize.height = 512;
spot.shadow.camera.near = 0.5;
spot.shadow.camera.far = 500;
spot.shadow.focus = 1;
spot.position.set(-10, 20, 10)
scene.add(spot)

/*****************************************************************************************************************************************************************
 * Create visualization elements
 *****************************************************************************************************************************************************************/

const radius = 10
let angle = 0
const angleIncrement = (Math.PI * 2) / frequencyData.length
const bars = []
frequencyData.forEach(() => {
  const material = new THREE.MeshLambertMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide
  })
  const geometry = new THREE.BoxGeometry(0.5, 0.1, 0.5)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true

  mesh.position.set(
    radius * Math.cos(angle),
    0,
    radius * Math.sin(angle)
  )

  angle += angleIncrement

//   mesh.position.set(
//     x,
//     0,
//     0
//   )

//   x += 1

  scene.add(mesh)
  bars.push(mesh)
})

const floorGeometry = new THREE.PlaneGeometry(100, 100)
const floorMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
})

const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x += Math.PI / 2
floor.receiveShadow = true

scene.add(floor)



/*****************************************************************************************************************************************************************
 * Render
 *****************************************************************************************************************************************************************/

const bbox = new THREE.Box3()

const draw = () => {
  analyser.getByteFrequencyData(frequencyData);

  bars.forEach((bar, index) => {
    const freq = frequencyData[index]
    bar.scale.y = remapFreq(1, 50, freq)

    const barBbox = bbox.setFromObject(bar)
    const height = barBbox.max.y - barBbox.min.y
    bar.position.y = height / 2
  })

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(() => draw())
}






draw()
