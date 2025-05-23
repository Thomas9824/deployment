'use client'

import { TransformContext } from '@/hooks/use-transform'
import { useCanvas } from '@/webgl/components/canvas'
import { useContextBridge } from '@react-three/drei'
import { Fragment, type PropsWithChildren, useId } from 'react'

export function WebGLTunnel({ children }: PropsWithChildren) {
  const { WebGLTunnel } = useCanvas()

  const ContextBridge = useContextBridge(TransformContext)

  const uuid = useId()

  if (!WebGLTunnel) return

  return (
    <WebGLTunnel.In>
      <ContextBridge key={uuid}>{children}</ContextBridge>
    </WebGLTunnel.In>
  )
}

export function DOMTunnel({ children }: PropsWithChildren) {
  const { DOMTunnel } = useCanvas()

  const uuid = useId()

  return (
    <DOMTunnel.In>
      <Fragment key={uuid}>{children}</Fragment>
    </DOMTunnel.In>
  )
}
