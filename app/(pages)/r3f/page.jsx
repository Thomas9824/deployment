import { Wrapper } from '@/app/(pages)/(components)/wrapper'
import { ParticlesAnimation } from '@/components/three-animation/particles'
import { TheatreProjectProvider } from '@/orchestra/theatre'
import { Canvas } from '@/webgl/components/canvas'

export default function Home() {
  return (
    <TheatreProjectProvider id="Satus-R3f" config="/config/Satus-R3f.json">
      <div style={{ background: '#fff', color: '#111', minHeight: '100vh', width: '100%' }}>
        <Wrapper theme="red" className="font-mono uppercase">
          <ParticlesAnimation />
        </Wrapper>
        <Canvas root />
      </div>
    </TheatreProjectProvider>
  )
}
