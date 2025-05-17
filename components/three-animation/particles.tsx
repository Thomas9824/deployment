'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import Stats from 'three/addons/libs/stats.module.js'
// import { Link } from '@/components/link'

// const MENU_PARTICLES = [
//   { label: 'HOME', href: '/' },
//   { label: 'STUFF', href: '/r3f' },
//   { label: 'ABOUT ME', href: '/storyblok' },
//   { label: 'CONTACT', href: '/hubspot' },
// ]

export const ParticlesAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<Stats>()
  // const [menuScreenPositions, setMenuScreenPositions] = useState([
  //   { x: 0, y: 0 },
  //   { x: 0, y: 0 },
  //   { x: 0, y: 0 },
  //   { x: 0, y: 0 },
  // ])
  // Référence pour le conteneur glassmorphism
  // const glassRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let group: THREE.Group
    let camera: THREE.PerspectiveCamera
    let scene: THREE.Scene
    let renderer: THREE.WebGLRenderer
    let particles: THREE.BufferGeometry
    let pointCloud: THREE.Points
    let linesMesh: THREE.LineSegments
    let particlePositions: Float32Array
    let positions: Float32Array
    let colors: Float32Array
    let particleColors: Float32Array
    let spriteMaterial: THREE.SpriteMaterial
    const particlesData: { velocity: THREE.Vector3; numConnections: number; isGreen: boolean; coordinates?: THREE.Vector3; sprite?: THREE.Sprite; lastUpdate?: number }[] = []

    const maxParticleCount = 1000
    let particleCount = 500
    const r = 800
    const rHalf = r / 2

    const effectController = {
      showDots: true,
      showLines: true,
      minDistance: 150,
      limitConnections: false,
      maxConnections: 20,
      particleCount: particleCount
    }

    // Génération d'un axe de rotation aléatoire et d'une vitesse aléatoire
    const randomAxis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
    const randomSpeed = 0.001 + Math.random() * 0.003 // vitesse entre 0.001 et 0.004 radians/frame
    let lastTime = Date.now() * 0.001

    // Tableau pour stocker les sprites des images projet
    const projectSprites: THREE.Sprite[] = []

    // Fonction pour créer une texture avec le texte des coordonnées
    const createCoordinateTexture = (x: number, y: number, z: number) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) return null

      canvas.width = 4096
      canvas.height = 1024
      // Suppression du fond noir
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.font = 'bold 384px Arial'
      context.fillStyle = '#00ff00'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      const text = `x:${Math.round(x)} y:${Math.round(y)} z:${Math.round(z)}`
      context.fillText(text, canvas.width / 2, canvas.height / 2)

      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      return texture
    }

    // Fonction pour mettre à jour la texture d'un sprite
    const updateSpriteTexture = (sprite: THREE.Sprite, x: number, y: number, z: number) => {
      const texture = createCoordinateTexture(x, y, z)
      if (texture) {
        sprite.material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 1
        })
      }
    }

    function init() {
      const container = containerRef.current
      if (!container) return

      // Utilisation de la taille de la fenêtre pour le renderer
      const width = window.innerWidth
      const height = window.innerHeight

      camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000)
      camera.position.z = 1750
      camera.position.y = 0

      scene = new THREE.Scene()

      group = new THREE.Group()
      scene.add(group)

      const segments = maxParticleCount * maxParticleCount

      positions = new Float32Array(segments * 3)
      colors = new Float32Array(segments * 3)

      const pMaterial = new THREE.PointsMaterial({
        color: 0x111111,
        size: 3,
        transparent: true,
        sizeAttenuation: false,
        vertexColors: true
      })

      // Création du matériau pour les coordonnées
      spriteMaterial = new THREE.SpriteMaterial({ 
        color: 0x00ff00,
        transparent: true,
        opacity: 0
      })

      particles = new THREE.BufferGeometry()
      particlePositions = new Float32Array(maxParticleCount * 3)
      particleColors = new Float32Array(maxParticleCount * 3)

      // Initialisation des couleurs pour toutes les particules
      for (let i = 0; i < maxParticleCount; i++) {
        particleColors[i * 3] = 0.1     // R
        particleColors[i * 3 + 1] = 0.1 // G
        particleColors[i * 3 + 2] = 0.1 // B
      }

      // Calcul du nombre exact de particules vertes (2%)
      const greenParticleCount = Math.floor(maxParticleCount * 0.02)
      let greenParticlesCreated = 0

      for (let i = 0; i < maxParticleCount; i++) {
        const u = Math.random()
        const v = Math.random()
        const theta = 2 * Math.PI * u
        const phi = Math.acos(2 * v - 1)
        const radius = r / 2
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.sin(phi) * Math.sin(theta)
        const z = radius * Math.cos(phi)

        particlePositions[i * 3] = x
        particlePositions[i * 3 + 1] = y
        particlePositions[i * 3 + 2] = z

        const isGreen = greenParticlesCreated < greenParticleCount
        if (isGreen) {
          greenParticlesCreated++
          // Définir la couleur verte pour cette particule
          particleColors[i * 3] = 0     // R
          particleColors[i * 3 + 1] = 1 // G
          particleColors[i * 3 + 2] = 0 // B
        }

        particlesData.push({
          velocity: new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2),
          numConnections: 0,
          isGreen,
          coordinates: isGreen ? new THREE.Vector3(x, y, z) : undefined
        })
      }

      particles.setDrawRange(0, particleCount)
      particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage))
      particles.setAttribute('color', new THREE.BufferAttribute(particleColors, 3).setUsage(THREE.DynamicDrawUsage))

      pointCloud = new THREE.Points(particles, pMaterial)
      group.add(pointCloud)

      const geometry = new THREE.BufferGeometry()

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage))

      geometry.computeBoundingSphere()
      geometry.setDrawRange(0, 0)

      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: false,
        color: 0x111111
      })

      linesMesh = new THREE.LineSegments(geometry, material)
      group.add(linesMesh)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setClearColor(0x000000, 0)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(width, height)
      container.appendChild(renderer.domElement)

      // statsRef.current = new Stats()
      // container.appendChild(statsRef.current.dom)

      window.addEventListener('resize', onWindowResize)
      animate()
    }

    function onWindowResize() {
      const width = window.innerWidth
      const height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      camera.position.z = 1750
      camera.position.y = 0
      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
    }

    function animate() {
      requestAnimationFrame(animate)

      let vertexpos = 0
      let colorpos = 0
      let numConnected = 0

      for (let i = 0; i < particleCount; i++)
        particlesData[i].numConnections = 0

      for (let i = 0; i < particleCount; i++) {
        const particleData = particlesData[i]
        const position = new THREE.Vector3(
          particlePositions[i * 3],
          particlePositions[i * 3 + 1],
          particlePositions[i * 3 + 2]
        )

        // Mise à jour de la couleur en fonction de la position
        if (particleData.isGreen) {
          // Maintien de la couleur verte
          particleColors[i * 3] = 0     // R
          particleColors[i * 3 + 1] = 1 // G
          particleColors[i * 3 + 2] = 0 // B

          // Mise à jour des coordonnées
          if (particleData.coordinates) {
            particleData.coordinates.set(
              particlePositions[i * 3],
              particlePositions[i * 3 + 1],
              particlePositions[i * 3 + 2]
            )
          }

          // Mise à jour ou création du sprite
          if (particleData.isGreen && particleData.coordinates && !particleData.sprite) {
            const sprite = new THREE.Sprite(spriteMaterial)
            sprite.scale.set(160, 40, 1)
            group.add(sprite)
            particleData.sprite = sprite
            particleData.lastUpdate = Date.now()
          }

          // Mise à jour de la position et de la texture du sprite
          if (particleData.sprite && particleData.coordinates) {
            // Calcul de la position relative à la particule
            const offset = 50 // Distance fixe par rapport à la particule
            const direction = new THREE.Vector3(
              particleData.coordinates.x,
              particleData.coordinates.y,
              particleData.coordinates.z
            ).normalize()

            // Position du sprite légèrement décalée dans la direction opposée au centre
            particleData.sprite.position.copy(particleData.coordinates)
            particleData.sprite.position.add(direction.multiplyScalar(offset))

            // Mise à jour des coordonnées toutes les 500ms
            const now = Date.now()
            if (!particleData.lastUpdate || now - particleData.lastUpdate > 500) {
              updateSpriteTexture(
                particleData.sprite,
                particleData.coordinates.x,
                particleData.coordinates.y,
                particleData.coordinates.z
              )
              particleData.lastUpdate = now
            }
          }
        } else {
          // Si la particule n'est pas verte, on vérifie si elle a un sprite
          if (particleData.sprite) {
            group.remove(particleData.sprite)
            particleData.sprite = undefined
          }
          particleColors[i * 3] = 0.1 // R
          particleColors[i * 3 + 1] = 0.1 // G
          particleColors[i * 3 + 2] = 0.1 // B
        }

        // Déplacement
        particlePositions[i * 3] += particleData.velocity.x
        particlePositions[i * 3 + 1] += particleData.velocity.y
        particlePositions[i * 3 + 2] += particleData.velocity.z

        // Rebond sur la sphère
        const newPos = new THREE.Vector3(
          particlePositions[i * 3],
          particlePositions[i * 3 + 1],
          particlePositions[i * 3 + 2]
        )
        if (newPos.length() > r / 2) {
          // Calcul du vecteur normal
          const normal = newPos.clone().normalize()
          // Produit scalaire vitesse . normale
          const v = particleData.velocity
          const dot = v.dot(normal)
          // Rebond : v = v - 2 * (v . n) * n
          v.sub(normal.multiplyScalar(2 * dot))
          // Replace la particule juste à l'intérieur de la sphère
          newPos.setLength(r / 2 - 1)
          particlePositions[i * 3] = newPos.x
          particlePositions[i * 3 + 1] = newPos.y
          particlePositions[i * 3 + 2] = newPos.z
        }

        if (effectController.limitConnections && particleData.numConnections >= effectController.maxConnections)
          continue

        for (let j = i + 1; j < particleCount; j++) {
          const particleDataB = particlesData[j]
          if (effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections)
            continue

          const dx = particlePositions[i * 3] - particlePositions[j * 3]
          const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1]
          const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < effectController.minDistance) {
            particleData.numConnections++
            particleDataB.numConnections++

            const alpha = 1.0 - dist / effectController.minDistance

            positions[vertexpos++] = particlePositions[i * 3]
            positions[vertexpos++] = particlePositions[i * 3 + 1]
            positions[vertexpos++] = particlePositions[i * 3 + 2]

            positions[vertexpos++] = particlePositions[j * 3]
            positions[vertexpos++] = particlePositions[j * 3 + 1]
            positions[vertexpos++] = particlePositions[j * 3 + 2]

            // Couleur noire pour chaque segment
            colors[colorpos++] = 17 / 255
            colors[colorpos++] = 17 / 255
            colors[colorpos++] = 17 / 255

            colors[colorpos++] = 17 / 255
            colors[colorpos++] = 17 / 255
            colors[colorpos++] = 17 / 255

            numConnected++
          }
        }
      }

      linesMesh.geometry.setDrawRange(0, numConnected * 2)
      linesMesh.geometry.attributes.position.needsUpdate = true
      linesMesh.geometry.attributes.color.needsUpdate = true

      pointCloud.geometry.attributes.position.needsUpdate = true
      pointCloud.geometry.attributes.color.needsUpdate = true

      // Rotation aléatoire de la sphère
      const now = Date.now() * 0.001
      const delta = now - lastTime
      lastTime = now
      group.rotateOnAxis(randomAxis, randomSpeed * delta * 60) // *60 pour compenser le delta
      renderer.render(scene, camera)

      // Synchronisation des mots du menu avec la position projetée des particules
      // const menuParticleIndices = [0, Math.floor(maxParticleCount/4), Math.floor(maxParticleCount/2), Math.floor(3*maxParticleCount/4)]
      // const newMenuScreenPositions = menuParticleIndices.map((idx) => {
      //   const vector = new THREE.Vector3(
      //     particlePositions[idx * 3],
      //     particlePositions[idx * 3 + 1],
      //     particlePositions[idx * 3 + 2]
      //   )
      //   vector.applyMatrix4(group.matrixWorld)
      //   vector.project(camera)
      //   const x = (vector.x * 0.5 + 0.5) * window.innerWidth
      //   const y = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight
      //   return { x, y }
      // })
      // setMenuScreenPositions(newMenuScreenPositions)

      // statsRef.current?.update()
    }

    init()

    return () => {
      window.removeEventListener('resize', onWindowResize)
      if (renderer) {
        renderer.dispose?.()
        // Supprime le canvas du DOM si présent
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement)
        }
      }
      // Libère la mémoire de la scène
      if (scene) {
        scene.clear?.()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'transparent',
        zIndex: 101,
        pointerEvents: 'none'
      }}
    />
  )
} 