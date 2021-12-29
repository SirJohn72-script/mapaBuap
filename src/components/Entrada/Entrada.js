import { useEffect, useRef } from "react"
import { moveCameraInitScene } from "../Mapa3/Scene"
import { gsap, Power2 } from "gsap"
import "./Entrada.css"

const Entrada = ({ setinitSceneSequence }) => {
  const timeline = gsap.timeline({ defaults: { duration: 2, ease: Power2.easeInOut } })
  const mountRef = useRef(null)

  useEffect(() => {
    const titlesAnimations = document.querySelectorAll(".gsapAnimationStagger")
    timeline.from(mountRef.current, { opacity: 0 }).from(
      titlesAnimations,
      {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.6,
        onComplete: () => setinitSceneSequence(true),
      },
      "-=0.4"
    )
  }, [timeline, setinitSceneSequence])

  return (
    <div className="Entrada Container" ref={mountRef}>
      <div className="Wrapper">
        <div className="CenteredDiv">
          <div className="Title">
            <h1 className="gsapAnimationStagger">
              BIENVENIDO AL MAPA <br />
              <b className="gsapAnimationStagger">BUAP 3D</b>
            </h1>
          </div>
          <div className="ButtonContainer gsapAnimationStagger">
            <button onClick={() => moveCameraInitScene()}>Iniciar</button>
          </div>
          <p className="gsapAnimationStagger">
            Aun en desarrollo && NO OFICIAL{" "}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Entrada
