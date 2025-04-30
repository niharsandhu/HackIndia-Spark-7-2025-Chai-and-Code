"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

// Define token types
type TokenAnimation = {
  id: string
  leftSrc: string
  rightIcon: string
  position: number
  active: boolean
  completed: boolean
  verticalOffset: number
  isGeneratingDust: boolean
}

export default function EnhancedPortal() {
  const [tokens, setTokens] = useState<TokenAnimation[]>([])
  const [dustParticles, setDustParticles] = useState<{id: string, x: number, y: number, size: number, opacity: number, speed: number, delay: number}[]>([])

  // Create a new token animation
  const createToken = () => {
    const tokenPairs = [
      {
        leftSrc: "/m.png?height=100&width=100",
        rightIcon: "/f1.png?height=100&width=100",
      },
      {
        leftSrc: "/m2.png?height=100&width=100",
        rightIcon: "/f1.png?height=100&width=100",
      },
      {
        leftSrc: "/m3.png?height=100&width=100",
        rightIcon: "/f1.png?height=100&width=100",
      },
      {
        leftSrc: "/m.png?height=100&width=100",
        rightIcon: "/f1.png?height=100&width=100",
      },
      {
        leftSrc: "/m2.png?height=100&width=100",
        rightIcon: "/f1.png?height=100&width=100",
      },
    ]

    const randomPair = tokenPairs[Math.floor(Math.random() * tokenPairs.length)]
    // Wider vertical distribution for full screen
    const verticalPosition = Math.random() * 120 - 60

    setTokens((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        leftSrc: randomPair.leftSrc,
        rightIcon: randomPair.rightIcon,
        position: -50, // Start off-screen to the left
        active: true,
        completed: false,
        verticalOffset: verticalPosition,
        isGeneratingDust: false
      },
    ])
  }

  // Function to create dust particles (emerging from line)
  const createDustBurst = (yPosition: number) => {
    const newParticles: {id: string, x: number, y: number, size: number, opacity: number, speed: number, delay: number}[] = []
    const numParticles = Math.floor(Math.random() * 15) + 15 // 15-30 particles
    const yRange = 100 // Wider vertical range for full screen

    for (let i = 0; i < numParticles; i++) {
      // Create particles with staggered start times
      newParticles.push({
        id: Math.random().toString(36).substring(7),
        x: 50, // Start exactly at the center line
        y: yPosition + (Math.random() * yRange - yRange/2), // Distribute along the line
        size: Math.random() * 2.5 + 0.5, // 0.5-3px
        opacity: Math.random() * 0.3 + 0.7, // 0.7-1.0
        speed: Math.random() * 3 + 2, // 2-5 (rightward speed)
        delay: Math.random() * 10 // Staggered start times
      })
    }

    setDustParticles(prev => [...prev, ...newParticles])
  }

  useEffect(() => {
    // Create multiple initial tokens for a fuller effect
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createToken(), i * 600)
    }

    // Create new tokens periodically - more frequently for full screen
    const interval = setInterval(() => {
      createToken()
    }, 2000)

    let frameCount = 0;
    // Animation loop
    const animationFrame = requestAnimationFrame(function animate() {
      frameCount++;

      // Update tokens
      setTokens(
        (prev) =>
          prev
            .map((token) => {
              // Calculate new position
              const newPosition = token.position + 0.3

              // If token reaches the portal (center)
              if (newPosition >= 0 && token.active) {
                // Generate dust when hitting the portal
                if (!token.isGeneratingDust) {
                  createDustBurst(50 + token.verticalOffset)
                }
                return {
                  ...token,
                  active: false,
                  position: 0.1,
                  isGeneratingDust: true
                }
              }

              // If token is completed and off screen to the right, mark for removal
              if (newPosition > 50 && !token.active) {
                return { ...token, completed: true, position: newPosition }
              }

              // Otherwise just update position
              return { ...token, position: newPosition }
            })
            .filter((token) => !token.completed), // Remove completed tokens
      )

      // Update dust particles - emerging from the line and moving right
      setDustParticles(prev =>
        prev
          .map(particle => {
            // Don't move particles until their delay has passed
            if (particle.delay > 0) {
              return {
                ...particle,
                delay: particle.delay - 1
              }
            }

            // Only move particles to the right, starting from the line
            const newX = particle.x + particle.speed * 0.25
            // Decrease opacity faster for smaller particles
            const opacityDecrement = particle.size < 1.5 ? 0.03 : 0.02
            const newOpacity = particle.opacity - opacityDecrement

            return {
              ...particle,
              x: newX,
              opacity: newOpacity,
              delay: 0
            }
          })
          .filter(particle => particle.opacity > 0)
      )

      requestAnimationFrame(animate)
    })

    return () => {
      clearInterval(interval)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div className="h-full w-full overflow-hidden bg-black">
      {/* Vertical Gold Portal Line */}
      <div className="absolute left-1/2 top-0 h-full w-2 transform -translate-x-1/2 z-20">
        <svg viewBox="0 0 10 800" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          <defs>
            {/* Gold gradient for the line */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#BF9B30" />
              <stop offset="50%" stopColor="#FFDF00" />
              <stop offset="100%" stopColor="#BF9B30" />
            </linearGradient>

            {/* Glow filter for the line */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Main vertical golden line */}
          <line
            x1="5"
            y1="0"
            x2="5"
            y2="800"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glow)"
          />
        </svg>
      </div>

      {/* Custom Dust Particles - emerging from line */}
      {dustParticles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.size > 1.5 ? '#FFDF00' : '#FFC800',
            opacity: particle.delay > 0 ? 0 : particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.size}px rgba(255, 223, 0, 0.6)`,
            transform: 'translate(-50%, -50%)',
            zIndex: 25
          }}
        />
      ))}

      {/* Tokens animation */}
      <AnimatePresence>
        {tokens.map((token) => (
          <div
            key={token.id}
            className="absolute transform -translate-y-1/2"
            style={{
              left: `calc(50% + ${token.position}%)`,
              top: `calc(50% + ${token.verticalOffset}%)`,
              zIndex: token.active ? 10 : 30,
            }}
          >
            {token.active ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 3,
                  exit: { duration: 0.2 }
                }}
                style={{
                  rotate: "0deg" // Using style prop for rotation instead of rotateY
                }}
              >
                <div className="relative w-24 h-24 bg-white/10 rounded-full p-2 flex items-center justify-center">
                  <Image
                    src={token.leftSrc}
                    alt="Token"
                    width={100}
                    height={100}
                    className="object-contain z-10"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 1
                }}
                style={{
                  rotate: "0deg" // Using style prop for rotation instead of rotateY
                }}
                className="relative w-24 h-24 bg-white/10 rounded-full p-2 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-md"></div>
                <div className="drop-shadow-[0_0_8px_rgba(255,223,0,0.8)] transform scale-125">
                  <Image
                    src={token.rightIcon}
                    alt="Token Icon"
                    width={100}
                    height={100}
                    className="object-contain z-10"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(255, 223, 0, 0.8))' }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </AnimatePresence>

      {/* Add a subtle pulsing effect to the line when tokens hit it */}
      <div className="absolute left-1/2 top-0 h-full w-6 transform -translate-x-1/2 pointer-events-none">
        <AnimatePresence>
          {tokens.some(t => Math.abs(t.position) < 0.5) && (
            <motion.div
              className="absolute inset-0 bg-yellow-400 rounded-full opacity-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.2, scale: 1.2 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Additional ambient glow in the center */}
      <div
        className="absolute left-1/2 top-1/2 w-32 h-96 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 rounded-full blur-3xl opacity-10"
      ></div>
    </div>
  )
}
