import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import * as dat from "dat.gui"
import { gsap, Power2 } from "gsap"
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect"

//Plane shaders
import { Vertex } from "./Shaders/Vertex"
import { Fragment } from "./Shaders/Fragment"

//Data from the canvas
let currentRef = null
let loadingBar = null

//Debuging
const gui = new dat.GUI({ width: 400 })
gui.closed = true


//timeline
const timeline = gsap.timeline({
  defaults: { duration: 3, ease: Power2.easeInOut },
})

//Scene, camera, renderer
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xcececd)
const camera = new THREE.PerspectiveCamera(
  60,
  100 / 100,
  0.1,
  250
)
scene.add(camera)
camera.position.set(-5.50889, 114.12489, 13.3497)

gui
  .add(camera.position, "x")
  .min(-40)
  .max(50)
  .step(0.00001)
  .name("Camera x")
gui
  .add(camera.position, "y")
  .min(0)
  .max(50)
  .step(0.00001)
  .name("Camera y")
gui
  .add(camera.position, "z")
  .min(-40)
  .max(50)
  .step(0.00001)
  .name("Camera z")

gui.add(camera, 'zoom')
  .min(1)
  .max(5)
  .name("Zoom")
  .onChange(() => {
    camera.updateProjectionMatrix()
  })

//Renderer properties
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
})
renderer.setSize(100, 100)
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.5
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.physicallyCorrectLights = true

//OrbitControls
const orbitControls = new OrbitControls(
  camera,
  renderer.domElement
)
orbitControls.enableDamping = true
// orbitControls.target.set(-1.0434, 7.13516, 7.76293)
orbitControls.target.set(0, 0, 0)
orbitControls.minDistance = 10
orbitControls.maxDistance = 40
orbitControls.maxPolarAngle = Math.PI * 0.40
orbitControls.enablePan = false

//outline effect
let effectOutline = new OutlineEffect(renderer)

//Resize canvas
const resize = () => {
  if (currentRef) {
    renderer.setSize(
      currentRef.clientWidth,
      currentRef.clientHeight
    )
    camera.aspect =
      currentRef.clientWidth / currentRef.clientHeight
    camera.updateProjectionMatrix()
  }
}
window.addEventListener("resize", resize)

//load the gradient map
const gradientMap = new THREE.TextureLoader().load(
  "./gradient/fiveTone.jpg"
)
gradientMap.minFilter = THREE.NearestFilter
gradientMap.magFilter = THREE.NearestFilter
gradientMap.generateMipmaps = false

//Llights
const light1 = new THREE.DirectionalLight(0xffffff, 7)
light1.position.set(10, 23, 44)
light1.castShadow = true
light1.shadow.camera.far = 120
light1.shadow.camera.left = -75
light1.shadow.camera.right = 75
light1.shadow.camera.top = 75
light1.shadow.camera.bottom = -75
light1.shadow.mapSize.set(1024, 1024)
light1.shadow.camera.near = 0.5 // default.shadow.camera.near = 0.5; // default
// light1.shadow.normalBias = 0.5
scene.add(light1)



//Shadow Helper
// const directionalLightHelper = new THREE.CameraHelper(
//   light1.shadow.camera
// )

//Ambiental Light
const ambientalLight = new THREE.AmbientLight(0xfff6dd, 6)
scene.add(ambientalLight)

//Add the plane for the plane for hide the camera
const planeGeometryOverlay = new THREE.PlaneBufferGeometry(
  2,
  2
)
const planeMaterialOverlay = new THREE.ShaderMaterial({
  transparent: true,
  uniforms: {
    uAlpha: { value: 1.0 },
  },
  vertexShader: Vertex,
  fragmentShader: Fragment,
})
const planeOverlay = new THREE.Mesh(
  planeGeometryOverlay,
  planeMaterialOverlay
)
planeOverlay.name = "PlaneOverlay"
scene.add(planeOverlay)

//Loading manger
const loaderManager = new THREE.LoadingManager(
  () => {
    gsap.delayedCall(3.0, () => {
      loadingBar.classList.add("ended")
      loadingBar.style.transform = ""
      gsap.to(planeMaterialOverlay.uniforms.uAlpha, {
        value: 0.0,
        duration: 1,
        onComplete: () => {
          scene.remove(planeOverlay)
          planeOverlay.geometry.dispose()
          planeOverlay.material.dispose()
        },
      })
 
      moveCameraInitScene()
      renderer.shadowMap.autoUpdate = false
      renderer.shadowMap.needsUpdate = true
    })
  },
  (itemurl, itemsLoaded, itemsTotal) => {
    const progessRatio = itemsLoaded / itemsTotal
    loadingBar.style.transform = `scaleX(${progessRatio})`
  },
  () => {
    console.log("Error")
  }
)

//Primer grupo
const grupoMapa1 = new THREE.Group()

//Load the model
const gltfloader = new GLTFLoader(loaderManager)

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("/draco/")
gltfloader.setDRACOLoader(dracoLoader)

gltfloader.load("./mapa/MapaD.gltf", (gltf) => {
  while (gltf.scene.children.length) {
    gltf.scene.children[0].castShadow = true
    gltf.scene.children[0].receiveShadow = true
    grupoMapa1.add(gltf.scene.children[0])
  }
  scene.add(grupoMapa1)
  updateAllMaterialsToToonMaterials()
})


//Material for the meshes
const materialToon = new THREE.MeshToonMaterial({
  gradientMap: gradientMap,
  color: 0xeeeeee,
  transparent: true, 
  displacementScale: 0.3,
  
})

//Animate the scene
const animate = () => {
  orbitControls.update()
  // renderer.render(scene, camera)
  effectOutline.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

//Cube for debugging
const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.5, 0.5, 0.5), 
  new THREE.MeshBasicMaterial({ color: 0xff0000})
)
scene.add(cube)

gui.add(cube.position, 'x')
  .min(-50)
  .max(50)
  .step(0.0001)
  .name("Target X")
  .onChange(() => {
    orbitControls.target.x = cube.position.x
  })
gui.add(cube.position, 'y')
  .min(-20)
  .max(20)
  .step(0.0001)
  .name("Target Y")
  .onChange(() => {
    orbitControls.target.y = cube.position.y
  })
gui.add(cube.position, 'z')
  .min(-50)
  .max(50)
  .step(0.0001)
  .name("Target z")
  .onChange(() => {
    orbitControls.target.z = cube.position.z
  })


const updateAllMaterialsToToonMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.name !== 'PlaneOverlay') {
      let map = null; 
      let alpha = null; 
      let ao = null 
      let displacement = null; 
      let normal = null;

      if (child.material.map !== null) {
        map = child.material.map
        alpha = child.material.alphaMap
        ao = child.material.aoMap; 
        displacement = child.material.displacementMap; 
        normal = child.material.normalMap; 
      }
      child.castShadow = true
      child.receiveShadow = true
      const color = child.material.color
      child.material = materialToon.clone()
      child.material.color.set(color)
      child.material.map = map
      child.material.alphaMap = alpha; 
      child.material.normalMap = normal
      child.material.aoMap = ao; 
      child.material.displacementMap = displacement; 
      child.material.needsUpdate = true
    }
  })
}

//Init the scene
export const initScene = (mountRef) => {
  loadingBar = document.querySelector(".loadingBar")
  currentRef = mountRef.current
  currentRef.appendChild(renderer.domElement)
  renderer.setSize(
    currentRef.clientWidth,
    currentRef.clientHeight
  )
  camera.aspect =
    currentRef.clientWidth / currentRef.clientHeight
  camera.updateProjectionMatrix()
}

//Clen the scene
export const cleaupScene = () => {
  scene.dispose()
  currentRef.removeChild(renderer.domElement)
  window.removeEventListener("resize", resize)
}

export const moveCameraInitScene = () => {
  timeline
    .to(
      orbitControls.target,
      {
        x: 0,
        y: 5,
        z: 0,
      },
      "+=1.0"
    )
    .to(
      camera.position,
      {
        x: 20,
        y: 14.75573,
        z: 20,
      },
      "-=1.5"
    )
}

export const animationToPlacePosition = (positions) => {
  timeline.to(
    camera.position, {
      x: positions.camera.x, 
      y: positions.camera.y, 
      z: positions.camera.z
    }, 
  ).to(orbitControls.target, {
    x: positions.target.x, 
    y: positions.target.y, 
    z: positions.target.z
  }, '-=2.8'
  
  ).to(camera, {
    zoom: positions.zoom, 
    onUpdate: () => camera.updateProjectionMatrix()
  }, '-=2.8'
  )

}
