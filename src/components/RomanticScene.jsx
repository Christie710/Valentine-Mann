import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

const CentralHeart = ({ accepted }) => {
  const meshRef = useRef(null);
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.35);
    shape.bezierCurveTo(0, 0.8, -0.65, 0.8, -0.65, 0.25);
    shape.bezierCurveTo(-0.65, -0.2, -0.2, -0.52, 0, -0.78);
    shape.bezierCurveTo(0.2, -0.52, 0.65, -0.2, 0.65, 0.25);
    shape.bezierCurveTo(0.65, 0.8, 0, 0.8, 0, 0.35);
    return shape;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.12;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.03;
    meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.015);
  });

  return (
    <Float speed={0.45} rotationIntensity={0.02} floatIntensity={0.2}>
      <mesh ref={meshRef} position={[0, 0.25, 0]}>
        <extrudeGeometry
          args={[
            heartShape,
            {
              depth: 0.38,
              bevelEnabled: true,
              bevelSegments: 10,
              steps: 1,
              bevelSize: 0.06,
              bevelThickness: 0.08
            }
          ]}
        />
        <meshPhysicalMaterial
          color={accepted ? "#f6c978" : "#f7c6d3"}
          emissive={accepted ? "#d79f4d" : "#6d132f"}
          emissiveIntensity={accepted ? 0.65 : 0.35}
          roughness={0.25}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.18}
        />
      </mesh>
    </Float>
  );
};

const OrbitHearts = ({ count = 12 }) => {
  const group = useRef(null);
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        angle: (index / count) * Math.PI * 2,
        radius: 2.5 + Math.random() * 1.4,
        speed: 0.03 + Math.random() * 0.07,
        y: (Math.random() - 0.5) * 1.2
      })),
    [count]
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((heart, index) => {
      const item = hearts[index];
      const angle = state.clock.elapsedTime * item.speed + item.angle;
      heart.position.set(Math.cos(angle) * item.radius, item.y + Math.sin(angle * 1.8) * 0.08, Math.sin(angle) * item.radius);
      heart.rotation.y = -angle;
    });
  });

  return (
    <group ref={group}>
      {hearts.map((_, index) => (
        <mesh key={`orbit-heart-${index}`} scale={0.12}>
          <octahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#f3d5df" emissive="#70414f" emissiveIntensity={0.15} metalness={0.4} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
};

const FallingPetals = ({ count = 80 }) => {
  const pointsRef = useRef(null);
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      speeds[i] = 0.003 + Math.random() * 0.006;
    }
    return { positions, speeds };
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i += 1) {
      positions[i * 3 + 1] -= points.speeds[i];
      positions[i * 3] += Math.sin(positions[i * 3 + 1] * 0.2) * 0.0012;
      if (positions[i * 3 + 1] < -5) {
        positions[i * 3 + 1] = 8;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c995a8" size={0.055} transparent opacity={0.38} />
    </points>
  );
};

const CameraRig = ({ focus }) => {
  useFrame((state) => {
    const { camera, mouse, clock } = state;
    const targetX = mouse.x * 0.28 + Math.sin(clock.elapsedTime * 0.22) * 0.08;
    const targetY = mouse.y * 0.12 + 0.1 + Math.cos(clock.elapsedTime * 0.18) * 0.04;
    const targetZ = focus === "question" ? 3.8 : focus === "moments" ? 4.7 : 5.5;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03);
    camera.lookAt(0, 0, 0);
  });
  return null;
};

const RomanticScene = ({ section, accepted }) => (
  <Canvas camera={{ position: [0, 0.2, 5.8], fov: 38 }}>
    <color attach="background" args={["#0d090b"]} />
    <fog attach="fog" args={["#0d090b", 5, 18]} />

    <ambientLight intensity={0.2} color="#d4c6cb" />
    <hemisphereLight intensity={0.25} color="#edd8bf" groundColor="#1a0f14" />
    <spotLight intensity={2.1} color="#f1d6a0" position={[2.8, 4, 1.5]} angle={0.36} penumbra={0.55} />
    <spotLight intensity={1.2} color="#9e3359" position={[-3.6, 1.8, -2.2]} angle={0.45} penumbra={0.7} />
    <pointLight intensity={0.6} color="#5c1f33" position={[-3, -1, -2]} />

    <CameraRig focus={section} />
    <CentralHeart accepted={accepted} />
    <OrbitHearts count={6} />
    <FallingPetals />
    <Sparkles count={75} scale={[12, 6, 12]} size={1.8} speed={0.11} color="#e9d6ba" />
    <Environment preset="night" />

    <EffectComposer>
      <DepthOfField focusDistance={0.03} focalLength={0.05} bokehScale={1.5} height={700} />
      <Bloom intensity={accepted ? 1.35 : 0.82} luminanceThreshold={0.38} mipmapBlur />
      <Noise opacity={0.03} />
      <Vignette eskil={false} offset={0.22} darkness={0.92} />
    </EffectComposer>
  </Canvas>
);

export default RomanticScene;
