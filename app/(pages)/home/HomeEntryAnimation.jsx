'use client'
import Gradientdiv from '@/components/Gradientdiv'
import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'

export function HomeEntryAnimation() {
  const navRef = useRef(null)
  const footerRef = useRef(null)
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const buttonRef = useRef(null)

  useLayoutEffect(() => {
    navRef.current = document.querySelector('nav')
    footerRef.current = document.querySelector('footer')

    // Debug : vérifier la présence du footer
    console.log('footerRef.current:', footerRef.current)

    // Masquer les items du menu (sauf le titre) avant l'animation
    const menuItems = navRef.current?.querySelectorAll('ul > li')
    if (menuItems && menuItems.length) {
      gsap.set(menuItems, { autoAlpha: 0 })
    }

    // Appliquer le style initial immédiatement pour éviter le flash
    if (navRef.current) {
      gsap.set(navRef.current, { y: -300, opacity: 0 })
    }
    if (footerRef.current) {
      gsap.set(footerRef.current, { y: 300, opacity: 0 })
    }

    // Animation d'arrivée du container central
    if (containerRef.current) {
      gsap.set(containerRef.current, { y: 60, opacity: 0 })
      gsap.to(containerRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.3,
        ease: 'power3.out',
        delay: 0.5,
        onComplete: () => {
          [titleRef, descRef, buttonRef].forEach((ref, i) => {
            if (ref.current) {
              gsap.fromTo(
                ref.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, delay: i * 0.18, ease: 'power3.out' }
              )
            }
          })
        }
      })
    }

    // Animation plus longue et plus marquée
    gsap.to(navRef.current, {
      y: 0,
      opacity: 1,
      duration: 2.2,
      ease: 'power3.out',
      delay: 0.15,
      onComplete: () => {
        // Animation des items du menu en cascade
        if (menuItems && menuItems.length) {
          gsap.set(menuItems, { x: -120, autoAlpha: 1 })
          gsap.to(menuItems, {
            x: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.18,
            delay: 0.1,
          })
        }
      }
    })
    gsap.to(footerRef.current, {
      y: 0,
      opacity: 1,
      duration: 2.2,
      ease: 'power3.out',
      delay: 0.45,
    })
  }, [])

  return (
    <Gradientdiv className="w-screen h-screen flex flex-col justify-between items-center">
      <nav ref={navRef} className="w-full flex justify-between p-4">
        {/* ... ton menu ici ... */}
      </nav>
      <div className="flex-1 flex items-center justify-center w-full">
        <div ref={containerRef} style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '24px',
          boxShadow: '0 4px 32px 0 rgba(0,0,0,0.10)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.25)',
          maxWidth: 700,
          width: '90vw',
          minHeight: 520,
          padding: '3.5rem 2.5rem 3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <span style={{
            position: 'absolute',
            top: '1.1rem',
            left: '1.2rem',
            fontSize: '2.2rem',
            fontWeight: 100,
            color: '#fff',
            letterSpacing: 2,
            opacity: 0.7,
            lineHeight: 1,
            pointerEvents: 'none',
          }}>✳</span>
          <div ref={titleRef} style={{fontSize: '2rem', color: '#fff', marginBottom: '1.5rem', opacity: 0}}>
            Hello I'm Thomas, an engineer student
          </div>
          <div ref={descRef} style={{color: '#fff', opacity: 0, fontSize: '1.1rem', marginBottom: '2.5rem'}}>
            Centralize communications, create advance AI assistants through chat, and gain actionable insights—all while keeping your data private.
          </div>
        </div>
      </div>
      <div ref={footerRef} className="w-full flex justify-center p-4">
      </div>
    </Gradientdiv>
  )
} 