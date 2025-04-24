"use client"

import { useEffect, useRef } from "react"

interface PriceChartProps {
  data: number[]
  change7d: number
}

export default function PriceChart({ data, change7d }: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 2

    // Find min and max values
    const minValue = Math.min(...data)
    const maxValue = Math.max(...data)
    const range = maxValue - minValue

    // Draw the line
    ctx.beginPath()
    ctx.strokeStyle = change7d >= 0 ? "#10b981" : "#ef4444"
    ctx.lineWidth = 1.5

    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding
      const y = height - ((value - minValue) / range) * (height - padding * 2) - padding

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Optional: Fill area under the line
    ctx.lineTo(width - padding, height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.closePath()
    ctx.fillStyle = change7d >= 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"
    ctx.fill()
  }, [data, change7d])

  return <canvas ref={canvasRef} width={150} height={50} className="w-full h-[50px]" />
}
