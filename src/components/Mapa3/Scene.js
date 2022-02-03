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

//Open the lists that contains the colleges faculty
let domElementPlacesBrowser = null

//Contains the text meshes for the colleges faculty
const Facultades3D = {}

//Debuging
// const gui = new dat.GUI({ width: 400 })
// gui.closed = true

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
orbitControls.maxPolarAngle = Math.PI * 0.4
orbitControls.enablePan = false

//outline effect
let effectOutline = new OutlineEffect(renderer)

//Resize canvas
const resize = () => {
  renderer.setSize(
    currentRef.clientWidth,
    currentRef.clientHeight
  )
  camera.aspect =
    currentRef.clientWidth / currentRef.clientHeight
  camera.updateProjectionMatrix()
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
          moveCameraInitScene()
        },
      })
      renderer.shadowMap.autoUpdate = false
      renderer.shadowMap.needsUpdate = true
    })
  },
  (itemurl, itemsLoaded, itemsTotal) => {
    const progessRatio = itemsLoaded / itemsTotal
    loadingBar.style.transform = `scaleX(${progessRatio})`
  },
  () => {}
)

//Load the model
const gltfloader = new GLTFLoader(loaderManager)

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("/draco/")
gltfloader.setDRACOLoader(dracoLoader)

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

const updateAllMaterialsToToonMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.name !== "PlaneOverlay"
    ) {
      let map = null
      let alpha = null
      let ao = null
      let displacement = null
      let normal = null

      if (child.material.map !== null) {
        map = child.material.map
        alpha = child.material.alphaMap
        ao = child.material.aoMap
        displacement = child.material.displacementMap
        normal = child.material.normalMap
      }
      child.castShadow = true
      child.receiveShadow = true
      const color = child.material.color
      child.material = materialToon.clone()
      child.material.color.set(color)
      child.material.map = map
      child.material.alphaMap = alpha
      child.material.normalMap = normal
      child.material.aoMap = ao
      child.material.displacementMap = displacement
      child.material.needsUpdate = true
    }
  })
}

//Init the scene
export const initScene = (mountRef) => {
  //Querys for the loading bar and select browser
  loadingBar = document.querySelector(".loadingBar")
  domElementPlacesBrowser = document.querySelector(
    ".selectorPlaces"
  )

  //Data for the canvas 3D
  currentRef = mountRef.current
  resize()
  currentRef.appendChild(renderer.domElement)
}

//Clen the scene
export const cleaupScene = () => {
  scene.dispose()
  currentRef.removeChild(renderer.domElement)
  window.removeEventListener("resize", resize)
}

//Load the text meshes for the the college faculties
export const loadTextToTheModels = (group, textRute) => {
  //Create the group for the text for the model
  Facultades3D[group] = { text: new THREE.Group() }

  gltfloader.load(textRute, (gltf) => {
    //If the group exists
    while (gltf.scene.children.length) {
      Facultades3D[group].text.add(gltf.scene.children[0])
    }
    Facultades3D[group].text.position.y = -10
    scene.add(Facultades3D[group].text)
  })
}

//Load the general map
export const loadGeneralMap = (modelRute) => {
  gltfloader.load(modelRute, (gltf) => {
    scene.add(gltf.scene)
  })
}

//Animations
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
    .to(domElementPlacesBrowser, {
      opacity: 1,
      duration: 1.0,
    })
}

export const animationToPlacePosition = (
  positions,
  grupo
) => {
  //Animations when the group is passed,
  //The general view doest have gruop or text
  resetTextAnimation()
  if (grupo) {
    timeline
      .to(camera.position, {
        x: positions.camera.x,
        y: positions.camera.y,
        z: positions.camera.z,
      })
      .to(
        orbitControls.target,
        {
          x: positions.target.x,
          y: positions.target.y,
          z: positions.target.z,
        },
        "-=2.8"
      )
      .to(
        camera,
        {
          zoom: positions.zoom,
          onUpdate: () => camera.updateProjectionMatrix(),
        },
        "-=2.8"
      )
      .to(
        Facultades3D[grupo].text.position,
        {
          y: 0,
          duration: 1.2,
          overwrite: true,
        },
        "-=0.8"
      )
  }
  //Animation for the general view
  else {
    timeline
      .to(camera.position, {
        x: positions.camera.x,
        y: positions.camera.y,
        z: positions.camera.z,
      })
      .to(
        orbitControls.target,
        {
          x: positions.target.x,
          y: positions.target.y,
          z: positions.target.z,
        },
        "-=2.8"
      )
      .to(
        camera,
        {
          zoom: positions.zoom,
          onUpdate: () => camera.updateProjectionMatrix(),
        },
        "-=2.8"
      )
  }
}

//Move back the text to the undergroung
export const resetTextAnimation = () => {
  Object.keys(Facultades3D).forEach(function (key, index) {
    Facultades3D[key].text.position.y = -10
  })
}

export const openPlacesBroser = () => {
  return true
}
