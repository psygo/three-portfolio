import { useMemo, useRef, useState } from "react";

import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/Addons.js";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  Html,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import {
  RigidBody,
  RigidBodyAutoCollider,
} from "@react-three/rapier";

export type Position = [number, number, number];

type ExtrudedSvgProps = {
  filename: string;
  colliderDefault?: RigidBodyAutoCollider;
  depth?: number;
  scale?: number;
  position?: Position;
};
export function ExtrudedSvg({
  filename,
  colliderDefault = "hull",
  depth = 5,
  scale = 1,
  position = [-10, 10, 0],
}: ExtrudedSvgProps) {
  const svgData = useLoader(SVGLoader, filename);
  const shapes = useMemo(
    () => svgData.paths.map((p) => p.toShapes(true)),
    [svgData]
  );

  const [visibleHtml, setVisibleHtml] = useState(false);

  const rigidBodyRef = useRef<any>(null);

  useFrame((_, delta) => {
    const currentExtrudedSvg = rigidBodyRef.current!;
    const vec = new THREE.Vector3();

    delta = Math.min(0.1, delta);

    if (currentExtrudedSvg) {
      currentExtrudedSvg.applyImpulse(
        vec
          .copy(currentExtrudedSvg.translation())
          .negate()
          .multiplyScalar(0.05)
      );
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={colliderDefault}
      position={position}
      linearDamping={7}
      angularDamping={1}
      friction={0.2}
    >
      <group>
        <Html
          style={{
            visibility: visibleHtml ? "visible" : "hidden",
          }}
          position={[
            position[0] + 5,
            position[1] + 3,
            position[2] + 2,
          ]}
          transform
        >
          <div
            style={{
              width: "300px",
              height: "max-content",
              padding: "10px",
              backgroundColor: "blue",
            }}
          >
            <h1>Hello There!</h1>
          </div>
        </Html>

        <group>
          {shapes.map((s, i) => (
            <mesh
              onClick={() => setVisibleHtml(!visibleHtml)}
              key={i}
              scale={scale}
              position={[0, 0, 0]}
            >
              <extrudeGeometry
                args={[
                  s,
                  {
                    depth,
                    bevelEnabled: false,
                    steps: 30,
                  },
                ]}
              />
              <meshPhysicalMaterial
                clearcoat={1}
                thickness={0.1}
                // anisotropicBlur={0.1}
                // chromaticAberration={0.1}
                // samples={8}
                // resolution={512}
              />

              <meshPhongMaterial
                attach="material"
                color={svgData.paths[i].color}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      </group>
    </RigidBody>
  );
}
