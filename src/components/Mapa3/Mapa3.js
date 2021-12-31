import { initScene, cleaupScene, animationToPlacePosition } from "./Scene"
import { useEffect, useRef } from "react"
import "./Styles.css"

//Objets for positions 
const positionsPlaces = [
  {
    name: 'Vista General',
    positions: {
      camera: {
        x: 20,
        y: 14.75573,
        z: 20,
      },
      target: {
        x: 0,
        y: 5,
        z: 0,
      },
      zoom: 1,
    }
  }, 
  {
    name: 'Torre Rectoria',
    positions: {
      camera: {
        x: -3.78831,
        y: 0,
        z: 10.27049,
      },
      target: {
        x: 0.5187,
        y: 4.4239,
        z: 2.0807
      },
      zoom: 1,
    }
  },
  {
    name: 'FACULTAD DE ADMINISTRACIÓN - ADM',
    positions: {
      camera: {
        x: 15.3473,
        y: 0,
        z: -3.20248,
      },
      target: {
        x: 5.986,
        y: 1,
        z: -9.8953
      },
      zoom: 1,
    }
  },
  {
    name: 'FACULTAD DE ARQUITECTURA - ARQ',
    positions: {
      camera: {
        x: -10,
        y: 0,
        z: 7.53687,
      },
      target: {
        x: -16.6643,
        y: 1,
        z: 0.779,
      },
      zoom: 1,
    }
  },
  {
    name: 'FACULTAD DE CIENCIAS BIOLÓGICAS - BIO',
    positions: {
      camera: {
        x: 7.855,
        y: 0,
        z: 7.53687,
      },
      target: {
        x: 5.69,
        y: 1,
        z: 0,
      },
      zoom: 1,
    }
  },
  {
    name: 'FACULTAD DE CIENCIAS DE LA COMPUTACIÓN - CCO',
    positions: {
      camera: {
        x: -29.71394,
        y: 0,
        z: 7.53687,
      },
      target: {
        x: -26.7955,
        y: 1,
        z: -13.51,
      },
      zoom: 2,
    }
  },
  {
    name: 'FACULTAD DE CIENCIAS DE LA ELECTRÓNICA - FCE',
    positions: {
      camera: {
        x: -19.766,
        y: 3.193,
        z: -19.766,
      },
      target: {
        x: -7.65,
        y: 1,
        z: -6.4884,
      },
      zoom: 1.7,
    }
  },
    {
    name: 'FACULTAD DE CIENCIAS FÍSICO-MATEMÁTICAS - FM',
    positions: {
      camera: {
        x: -9.22,
        y: 8.074,
        z: 2.49,
      },
      target: {
        x: 1.3221,
        y: 1,
        z: -11.5651,
      },
      zoom: 2,
    }
  },
  {
    name: 'FACULTAD DE CONTADURÍA PÚBLICA - FCP',
    positions: {
      camera: {
        x: -19.02,
        y: 1,
        z: -0.27,
      },
      target: {
        x: -14.3354,
        y: 1,
        z: 26.0836,
      },
      zoom: 2,
    }
  },
    {
    name: 'FACULTAD DE CIENCIAS QUÍMICAS - FCQ - I',
    positions: {
      camera: {
        x: -19.02,
        y: 1,
        z: -0.27,
      },
      target: {
        x: -21.3648,
        y: 1,
        z: -12.5781,
      },
      zoom: 1,
    }
  },
    {
    name: 'FACULTAD DE CIENCIAS QUÍMICAS - FCQ - II',
    positions: {
      camera: {
        x: -0.8614,
        y: 1,
        z: -11.9922,
      },
      target: {
        x: 6.167,
        y: 0,
        z: -4.9629,
      },
      zoom: 1,
    }
  },
  {
    name: 'FACULTAD DE CIENCIAS QUÍMICAS - FCQ - III',
    positions: {
      camera: {
        x: 23.155,
        y: 1,
        z: 50,
      },
      target: {
        x: 29.0125,
        y: 1,
        z: 34.2846,
      },
      zoom: 3,
    }
  },
  {
    name: 'FACULTAD DE DERECHO Y CIENCIAS SOCIALES - DER',
    positions: {
      camera: {
        x: 23.155,
        y: 1,
        z: 50,
      },
      target: {
        x: 14.9537,
        y: 1,
        z: -11.4065,
      },
      zoom: 3,
    }
  },
  {
    name: 'FACULTAD DE ECONOMÍA - ECO',
    positions: {
      camera: {
        x: 17.29,
        y: 1,
        z: 4.4096,
      },
      target: {
        x: 23.7405,
        y: 1,
        z: -11.4065,
      },
      zoom: 2,
    }
  },
  {
    name: 'FACULTAD DE FILOSOFÍA Y ANTROPOLOGÍA - FIL',
    positions: {
      camera: {
        x: 35.456,
        y: 1,
        z: 24.91,
      },
      target: {
        x: 50,
        y: 1,
        z: 5.5,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'FACULTAD DE INGENIERÍA - ING',
    positions: {
      camera: {
        x: 0.309,
        y: 1,
        z: 20.255,
      },
      target: {
        x: -9.0634,
        y: 1,
        z: 1.48,
      },
      zoom: 2.5,
    }
  },
   {
    name: 'FACULTAD DE INGENIERÍA QUÍMICA - FIQ',
    positions: {
      camera: {
        x: -19.02,
        y: 1,
        z: -0.27,
      },
      target: {
        x: -17.26,
        y: 1,
        z: -12.5781,
      },
      zoom: 1,
    }
  },
  {
    name: 'FACULTAD DE MEDICINA VETERINARIA Y ZOOTECNIA "HOSPITAL VETERINARIO, PUEBLA" - MVZ',
    positions: {
      camera: {
        x: -9.64,
        y: 1,
        z: 31.355,
      },
      target: {
        x: 4.9954,
        y: 1,
        z: 29.5983,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'EDIFICIO MULTIAULAS - EMAI',
    positions: {
      camera: {
        x: -2.65,
        y: 1,
        z: -20.193,
      },
      target: {
        x: -17.2643,
        y: 1,
        z: -4.96,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'EDIFICIO MULTIAULAS - EMAII',
    positions: {
      camera: {
        x: -2.65,
        y: 1,
        z: -20.193,
      },
      target: {
        x: -12.57,
        y: 1,
        z: -0.8624,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'EDIFICIO MULTIAULAS - EMAIII',
    positions: {
      camera: {
        x: -21.95,
        y: 1,
        z: 2.65,
      },
      target: {
        x: -7.8918,
        y: 1,
        z: -10.2349,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'EDIFICIO MULTIAULAS - EMAIII',
    positions: {
      camera: {
        x: -21.95,
        y: 1,
        z: 2.65,
      },
      target: {
        x: -7.8918,
        y: 1,
        z: -10.2349,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'EDIFICIO MULTIAULAS - EMAIV',
    positions: {
      camera: {
        x: 15.539,
        y: 1,
        z: 16.711,
      },
      target: {
        x: 9.0959,
        y: 1.5,
        z: 29.0125,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'EDIFICIO MULTIAULAS - EMAV',
    positions: {
      camera: {
        x: 15.539,
        y: 1,
        z: 16.711,
      },
      target: {
        x: 9.68,
        y: 1.5,
        z: 30.7699,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'EDIFICIO MULTIAULAS - EMAVI',
    positions: {
      camera: {
        x: 15.539,
        y: 1,
        z: 16.711,
      },
      target: {
        x: 8.5101,
        y: 1.5,
        z: 26.6694,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'EDIFICIO MULTIAULAS - EMAVII',
    positions: {
      camera: {
        x: 36.0419,
        y: 1,
        z: 47.17177,
      },
      target: {
        x: 31.1869,
        y: 1.5,
        z: 33.5362,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'EDIFICIO MULTIAULAS - EMAVIII',
    positions: {
      camera: {
        x: -2.61975,
        y: 1,
        z: -33.666,
      },
      target: {
        x: 7.30,
        y: 1.5,
        z: -14.92,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'FACULTAD DE LENGUAS - LEN',
    positions: {
      camera: {
        x: 14.36794,
        y: 1,
        z: -32.4956,
      },
      target: {
        x: 30.7699,
        y: 1.5,
        z: -14.3354,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'INSTITUTO DE FISIOLOGÍA - IFI',
    positions: {
      camera: {
        x: -4.64,
        y: 1,
        z: -27.54,
      },
      target: {
        x: -35.4236,
        y: 1.0,
        z: -16.0927,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'IFUAP / INSTITUTO DE FÍSICA - IF',
    positions: {
      camera: {
        x: -4.64,
        y: 1,
        z: -27.54,
      },
      target: {
        x: -6.7202,
        y: 1.0,
        z: -13.1638,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'ICUAP / INSTITUTO DE CIENCIAS - IC - I',
    positions: {
      camera: {
        x: -28.39,
        y: 1,
        z: -25.465,
      },
      target: {
        x: -41.6607,
        y: 1.0,
        z: -18.2294,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'ICUAP / INSTITUTO DE CIENCIAS - IC - II',
    positions: {
      camera: {
        x: -28.39,
        y: 1,
        z: -25.465,
      },
      target: {
        x: -33.85,
        y: 1.0,
        z: -16.27,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'ICUAP / INSTITUTO DE CIENCIAS - IC - III',
    positions: {
      camera: {
        x: -35.42,
        y: 1,
        z: 7.92343,
      },
      target: {
        x: -26.69,
        y: 1.0,
        z: -11.45,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'ICUAP / INSTITUTO DE CIENCIAS - IC - IV',
    positions: {
      camera: {
        x: 17.456,
        y: 1,
        z: 7.92343,
      },
      target: {
        x: 7.5545,
        y: 1.0,
        z: -1.9577,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'ICUAP / INSTITUTO DE CIENCIAS - IC - V',
    positions: {
      camera: {
        x: 50,
        y: 1,
        z: -22.847,
      },
      target: {
        x: 35.1419,
        y: 1.5,
        z: -14.3242,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'ICUAP / INSTITUTO DE CIENCIAS - IC - VI',
    positions: {
      camera: {
        x: 24.91203,
        y: 1,
        z: 18.4684,
      },
      target: {
        x: 29.284,
        y: 1.0,
        z: 31.8875,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'ARENA BUAP',
    positions: {
      camera: {
        x: 24.91203,
        y: 1,
        z: 18.4684,
      },
      target: {
        x: -6.5138,
        y: 1.5,
        z: 14.314,
      },
      zoom: 2.5,
    }
  },
  {
    name: 'ESTADIO',
    positions: {
      camera: {
        x: 24.32,
        y: 1,
        z: 34.87033,
      },
      target: {
        x: 38.39,
        y: 1.5,
        z: 15.615,
      },
      zoom: 2,
    }
  },
  {
    name: 'BIBLIOTECA CENTRAL',
    positions: {
      camera: {
        x: 24.32,
        y: 1,
        z: 34.87033,
      },
      target: {
        x: 15.6158,
        y: 1.5,
        z: 36.4436,
      },
      zoom: 1.5,
    }
  },
]

const Mapa3 = () => {
  const mountRef = useRef(null)

  //Use effect for the 3D map
  useEffect(() => {
    initScene(mountRef)

    return () => {
      cleaupScene()
    }
  }, [])

  return (
    <>
      <div
        className="Mapa"
        ref={mountRef}
      >
        {
        //Loading bar - dont touch
        }
        <div className="loadingBar"></div>

        {
          //Places Selector
        }
        <div className="selectorPosicion">
          <select className='selectorPlaces'
            //Get the posicionts for the selected place
            onChange={(e) => {
              const positions = positionsPlaces.find(place => (
                e.target.value === place.name
              ))
              animationToPlacePosition(positions.positions)
            }}
            >
            {
              //Map the places for the map 
              positionsPlaces.map((item, index) => (
                <option value={item.name}
                  key ={index}>
                  {item.name}
                </option>
              ))
             }
          </select>
        </div>
      </div>
    </>
  )
}

export default Mapa3
