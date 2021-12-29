import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";

const Mapa2 = () => {
  const mountRef = useRef();

  useEffect(() => {
    const gui = new dat.GUI({ width: 400 });
    gui.closed = true;
    const debugObject = {
      enviromentIntensity: 1.029,
    };
    gui
      .add(debugObject, "enviromentIntensity")
      .min(0)
      .max(10)
      .step(0.0005)
      .name("Evp Intensity")
      .onChange(() => updateModel());

    //Data from the canvas
    const currentRef = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentRef;

    //Scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 1000);
    scene.add(camera);
    camera.position.set(38, 24, 69);
    gui.add(camera.position, "x").min(-50).max(100).step(0.0001).name("Pos X");
    gui.add(camera.position, "y").min(-50).max(100).step(0.0001).name("Pos Y");
    gui.add(camera.position, "z").min(-50).max(100).step(0.0001).name("Pos Z");
    camera.lookAt(new THREE.Vector3());
    scene.background = new THREE.Color(0xfff6dd);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentRef.appendChild(renderer.domElement);

    //OrbitControls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.enableDamping = true;
    orbitControls.maxDistance = 140;
    orbitControls.minDistance = 30;
    orbitControls.maxPolarAngle = Math.PI * 0.45;
    orbitControls.minPolarAngle = Math.PI * 0.2;

    //Resize canvas
    const resize = () => {
      renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
      camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);

    //Load the EvnMap
    const env = new THREE.CubeTextureLoader().load([
      "./envMap/2/px.png",
      "./envMap/2/nx.png",
      "./envMap/2/py.png",
      "./envMap/2/ny.png",
      "./envMap/2/pz.png",
      "./envMap/2/nz.png",
    ]);
    scene.environment = env;

    //Animate the scene
    const animate = () => {
      orbitControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
    //cont grupos
    const escenario = new THREE.Group();

    //Load models
    const gltLoader = new GLTFLoader();
    gltLoader.load("./mapa2/Mapa.gltf", (gltf) => {
      while (gltf.scene.children.length) {
        escenario.add(gltf.scene.children[0]);
      }
      scene.add(escenario);
    });
    // escenario.position.y = -10;

    //gradient map
    const gradientMap = new THREE.TextureLoader().load(
      "./gradient/fiveTone.jpg"
    );
    gradientMap.minFilter = THREE.NearestFilter;
    gradientMap.magFilter = THREE.NearestFilter;

    //update model
    const updateModel = () => {
      escenario.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.envMapIntensity = debugObject.enviromentIntensity;
          child.material.needsUpdate = true;
        }
      });
    };

    //Llights
    const light1 = new THREE.DirectionalLight(0xffffff, 2.315);
    light1.position.set(0, 111, 0);
    scene.add(light1);

    gui.add(light1.position, "x").min(-200).max(200).step(1);
    gui.add(light1.position, "y").min(-200).max(200).step(1);
    gui.add(light1.position, "z").min(-200).max(200).step(1);
    gui.add(light1, "intensity").min(0).max(7).step(0.0005);

    const ambientalLight = new THREE.AmbientLight(0xfff6dd, 2.0705);
    scene.add(ambientalLight);
    gui.add(ambientalLight, "intensity").min(0).max(10).step(0.0005).name("AL");

    return () => {
      window.removeEventListener("resize", resize);
      currentRef.removeChild(renderer.domElement);
    };
  });

  return (
    <div
      className='contenedor3D'
      ref={mountRef}
      style={{ width: "100%", height: "100vh" }}
    ></div>
  );
};

export default Mapa2;
