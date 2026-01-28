'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei'
import * as THREE from 'three'
import { Model as KresgeTop } from '@/app/components/models/KresgeTop'
import { Model as KresgeBottom } from '@/app/components/models/KresgeBottom'
import { Model as BookShelf } from '@/app/components/models/BookShelf'
import { Model as Bear } from '@/app/components/models/Bear'

// A simple rotating component wrapper
function Spinner({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.5
  })
  return <group ref={ref}>{children}</group>
}

// The main 3D Scene
export function Experience({ asset }: { asset: string }) {
  const pos = asset == 'Achievements' ? [0, 0, 15] : [-15, 15, 15]
  return (
    <Canvas camera={{ position: pos, fov: 60 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      
      {/* <Spinner> */}
        {/* Switch content based on prop */}
        {asset === 'cube' && (
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        )}
        
        {asset === 'kresge_top' && (
          <mesh>
            <Center>
            <KresgeBottom transparent={true} opacity={0.1} />
            <KresgeTop />
            </Center>
          </mesh>
        )}

        {asset === 'kresge_bottom' && (
          <mesh>
            <Center>
            <KresgeTop transparent={true} opacity={0.1} />
            <KresgeBottom/>
            </Center>
          </mesh>
        )}
        {asset === 'Achievements' && (
          <mesh>
            <Center>
            <Bear position={[2.5, -4, 2]} />
            <BookShelf/>
            </Center>
          </mesh>
        )}
        
      {/* </Spinner> */}

      <ContactShadows position={[0, -2, 0]} opacity={0} blur={2.5} />
      <Environment preset="city" />
      {asset == 'Achievements' ? 
      <OrbitControls 
      makeDefault 
      // 2. LOCK VERTICAL ROTATION
      // 0 = Top down (North pole)
      // Math.PI / 2 = Horizon (Eye level)
      // Math.PI / 4 = 45 degree angle (Isometric view)
      minPolarAngle={Math.PI / 2} 
      maxPolarAngle={Math.PI / 2}
      
      // Optional: Disable panning so they can't drag the building off-screen
      // enablePan={false}
    />:
      <OrbitControls 
        makeDefault 
        // 2. LOCK VERTICAL ROTATION
        // 0 = Top down (North pole)
        // Math.PI / 2 = Horizon (Eye level)
        // Math.PI / 4 = 45 degree angle (Isometric view)
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 4}
        
        // Optional: Disable panning so they can't drag the building off-screen
        // enablePan={false}
      />
      }
    </Canvas>
  )
}