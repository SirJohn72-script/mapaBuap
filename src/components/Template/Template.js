import { useRef, useEffect } from 'react'
import * as THREE from 'three'

const Template = () => {
    const mountRef = useRef(null)

    return (
        <div
            className="Contenedor3D"
            ref = {mountRef}
            style={{ width: '100%', height: '100vh' }}>
            <h1>Hola mundo</h1>
        </div>
    )
}

export default Template
