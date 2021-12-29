import { initScene, cleaupScene } from "./Scene"
import { useEffect, useRef } from "react"
import "./Styles.css"

const Mapa3 = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    initScene(mountRef)

    return () => {
      cleaupScene()
    }
  }, [])

  return (
    <>
      <div
        className="Mapa3"
        ref={mountRef}
        style={{ width: "100%", height: "100vh" }}
      >
        <div className="loadingBar"></div>
      </div>
    </>
  )
}

export default Mapa3
