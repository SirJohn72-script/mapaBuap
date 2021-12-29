import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//Global variables
let currentRef = null;

//Scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf8efd8);
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 100);
scene.add(camera);
camera.position.set(10, 1.5, 10);
camera.position.set(0, 10, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(100, 100);

//OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

//Resize canvas
const resize = () => {
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);

//Animate the scene
const animate = () => {
  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

//Load the texture
const textureLoader = new THREE.TextureLoader();
const base = textureLoader.load("./arbol/Base2.png");
const Alpha = textureLoader.load("./arbol/Base2.png");

//cube
const material = new THREE.PointsMaterial({
  map: base,
  alphaMap: Alpha,
});
material.transparent = true;
material.alphaTest = 0.1;
material.depthTest = true;

const vertices = [];
for (let i = 0; i < 300; i++) {
  const x = Math.random() * (2 + 2) + 2;
  const z = Math.random() * (2 + 2) + 2;
  vertices.push(x, 0, z);
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(vertices, 3)
);

const points = new THREE.Points(geometry, material);
points.castShadow = true;
scene.add(points);
camera.lookAt(points);

//planeshaodw
const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: "red" })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.1;
plane.position.set(2, -0.1, 2);
plane.receiveShadow = true;
scene.add(plane);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(4, 4, 4);
scene.add(light);

//Init and mount the scene
export const initScene = (mountRef) => {
  currentRef = mountRef.current;
  resize();
  currentRef.appendChild(renderer.domElement);
};

//Dismount and clena up the buffer from the scene
export const cleanUpScene = () => {
  scene.dispose();
  currentRef.removeChild(renderer.domElement);
};
