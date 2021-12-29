import { useEffect, useRef } from "react";
import { cleanUpScene, initScene } from "./Scene";

const Arboles = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    initScene(mountRef);

    return () => {
      cleanUpScene();
    };
  }, []);

  return (
    <div
      className='Contendor Arboles'
      ref={mountRef}
      style={{ width: "100%", height: "100vh" }}
    ></div>
  );
};

export default Arboles;
