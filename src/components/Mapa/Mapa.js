import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Mapa = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    //Data from the canvas
    const currentRef = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentRef;

    //Scene, camera, renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);
    // const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
    const aspectRatio = width / height;
    const viewSize = 1;
    const top = viewSize / 2;
    const bottom = viewSize / -2;
    const right = (0.5 * aspectRatio * viewSize) / 2;
    const left = (0.5 * aspectRatio * viewSize) / -2;
    const camera = new THREE.OrthographicCamera(
      left,
      right,
      top,
      bottom,
      10.0,
      1500
    );
    scene.add(camera);
    camera.position.set(10, 10, 10);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    currentRef.appendChild(renderer.domElement);

    //OrbitControls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;

    //Resize canvas
    const resize = () => {
      renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
      const aspectRatioUpdate =
        currentRef.clientWidth / currentRef.clientHeight;
      camera.left = (0.5 * aspectRatioUpdate * viewSize) / -2;
      camera.right = (0.5 * aspectRatioUpdate * viewSize) / 2;
      camera.top = viewSize / 2;
      camera.bottom = viewSize / -2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);

    //Import the model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("./model/mapa.gltf", (gltf) => {
      while (gltf.scene.children.length) {
        gltf.scene.children[0].material = new THREE.MeshNormalMaterial();
        scene.add(gltf.scene.children[0]);
      }
      // scene.add(gltf.scene);
    });

    const ambientalLight = new THREE.AmbientLight(0xff0000, 1);
    scene.add(ambientalLight);

    const directionalLight = new THREE.DirectionalLight(0xff00ff, 1);
    directionalLight.position.set(10, 10, 10);
    // scene.add(directionalLight);

    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(light);

    //Animate the scene
    const animate = () => {
      orbitControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      currentRef.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      className='Contenedor3D'
      ref={mountRef}
      style={{ width: "100%", height: "100vh" }}
    ></div>
  );
};

export default Mapa;
