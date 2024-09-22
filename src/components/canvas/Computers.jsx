import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

// Constantes para la configuración de la escena
const LIGHT_SETTINGS = {
  hemisphere: { intensity: 0.15, groundColor: 'black' },
  spot: { position: [-20, 50, 10], angle: 0.12, penumbra: 1, intensity: 1, castShadow: true, shadowMapSize: 1024 },
  point: { intensity: 1 }
};

const CAMERA_SETTINGS = {
  position: [20, 3, 5],
  fov: 25
};

const COMPUTERS_SETTINGS = {
  scale: { mobile: 0.7, desktop: 0.75 },
  position: { mobile: [0, -3, -2.2], desktop: [0, -3.25, -1.5] },
  rotation: [-0.01, -0.2, -0.1]
};

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <mesh>
      <hemisphereLight {...LIGHT_SETTINGS.hemisphere} />
      <spotLight {...LIGHT_SETTINGS.spot} />
      <pointLight {...LIGHT_SETTINGS.point} />
      <primitive
        object={computer.scene}
        scale={isMobile ? COMPUTERS_SETTINGS.scale.mobile : COMPUTERS_SETTINGS.scale.desktop}
        position={isMobile ? COMPUTERS_SETTINGS.position.mobile : COMPUTERS_SETTINGS.position.desktop}
        rotation={COMPUTERS_SETTINGS.rotation}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 500px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ ...CAMERA_SETTINGS }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
