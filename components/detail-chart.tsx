"use client"

import { useEffect, useRef, useState } from "react"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

interface DetailChartProps {
  data: number[]
  change7d: number
}

export default function DetailChart({ data, change7d }: DetailChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [period, setPeriod] = useState("7d")
  const [hoverPrice, setHoverPrice] = useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  // Generate more data points for different time periods
  const generateExtendedData = () => {
    // For demo purposes, we'll just duplicate and modify the existing data
    const baseData = [...data]

    // Generate 30 days of data by repeating and slightly modifying the 7-day data
    const monthData = []
    for (let i = 0; i < 4; i++) {
      const multiplier = 1 + (Math.random() * 0.2 - 0.1) * i
      monthData.push(...baseData.map((val) => val * multiplier))
    }

    // Generate 1 year of data
    const yearData = []
    for (let i = 0; i < 12; i++) {
      const multiplier = 1 + (Math.random() * 0.5 - 0.25) * i
      yearData.push(...baseData.map((val) => val * multiplier))
    }

    return {
      "24h": baseData.slice(-24),
      "7d": baseData,
      "30d": monthData,
      "1y": yearData,
    }
  }

  const extendedData = generateExtendedData()

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 20

    // Get current data based on selected period
    const currentData = extendedData[period as keyof typeof extendedData]

    // Find min and max values
    const minValue = Math.min(...currentData)
    const maxValue = Math.max(...currentData)
    const range = maxValue - minValue

    // Draw the grid lines
    ctx.beginPath()
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (height - padding * 2) * (i / 4)
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
    }

    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
      const x = padding + (width - padding * 2) * (i / 6)
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
    }
    ctx.stroke()

    // Draw the line
    ctx.beginPath()
    ctx.strokeStyle = change7d >= 0 ? "#10b981" : "#ef4444"
    ctx.lineWidth = 2

    currentData.forEach((value, index) => {
      const x = padding + (index / (currentData.length - 1)) * (width - padding * 2)
      const y = height - padding - ((value - minValue) / range) * (height - padding * 2)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(width - padding, height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.closePath()
    ctx.fillStyle = change7d >= 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"
    ctx.fill()

    // Add hover functionality
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const dataWidth = width - padding * 2
      const dataIndex = Math.round(((x - padding) / dataWidth) * (currentData.length - 1))

      if (dataIndex >= 0 && dataIndex < currentData.length) {
        setHoverIndex(dataIndex)
        setHoverPrice(currentData[dataIndex])

        // Draw hover indicator
        ctx.clearRect(0, 0, width, height)

        // Redraw grid
        ctx.beginPath()
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
        ctx.lineWidth = 1
        for (let i = 0; i <= 4; i++) {
          const y = padding + (height - padding * 2) * (i / 4)
          ctx.moveTo(padding, y)
          ctx.lineTo(width - padding, y)
        }
        for (let i = 0; i <= 6; i++) {
          const x = padding + (width - padding * 2) * (i / 6)
          ctx.moveTo(x, padding)
          ctx.lineTo(x, height - padding)
        }
        ctx.stroke()

        // Redraw line
        ctx.beginPath()
        ctx.strokeStyle = change7d >= 0 ? "#10b981" : "#ef4444"
        ctx.lineWidth = 2
        currentData.forEach((value, index) => {
          const pointX = padding + (index / (currentData.length - 1)) * (width - padding * 2)
          const pointY = height - padding - ((value - minValue) / range) * (height - padding * 2)
          if (index === 0) {
            ctx.moveTo(pointX, pointY)
          } else {
            ctx.lineTo(pointX, pointY)
          }
        })
        ctx.stroke()

        // Refill area
        ctx.lineTo(width - padding, height - padding)
        ctx.lineTo(padding, height - padding)
        ctx.closePath()
        ctx.fillStyle = change7d >= 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"
        ctx.fill()

        // Draw hover line
        const hoverX = padding + (dataIndex / (currentData.length - 1)) * (width - padding * 2)
        const hoverY = height - padding - ((currentData[dataIndex] - minValue) / range) * (height - padding * 2)

        ctx.beginPath()
        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)"
        ctx.setLineDash([5, 5])
        ctx.moveTo(hoverX, padding)
        ctx.lineTo(hoverX, height - padding)
        ctx.stroke()
        ctx.setLineDash([])

        // Draw point
        ctx.beginPath()
        ctx.fillStyle = change7d >= 0 ? "#10b981" : "#ef4444"
        ctx.arc(hoverX, hoverY, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    const handleMouseLeave = () => {
      setHoverIndex(null)
      setHoverPrice(null)

      // Redraw the chart without hover effects
      ctx.clearRect(0, 0, width, height)

      // Redraw grid
      ctx.beginPath()
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
      ctx.lineWidth = 1
      for (let i = 0; i <= 4; i++) {
        const y = padding + (height - padding * 2) * (i / 4)
        ctx.moveTo(padding, y)
        ctx.lineTo(width - padding, y)
      }
      for (let i = 0; i <= 6; i++) {
        const x = padding + (width - padding * 2) * (i / 6)
        ctx.moveTo(x, padding)
        ctx.lineTo(x, height - padding)
      }
      ctx.stroke()

      // Redraw line
      ctx.beginPath()
      ctx.strokeStyle = change7d >= 0 ? "#10b981" : "#ef4444"
      ctx.lineWidth = 2
      currentData.forEach((value, index) => {
        const x = padding + (index / (currentData.length - 1)) * (width - padding * 2)
        const y = height - padding - ((value - minValue) / range) * (height - padding * 2)
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Refill area
      ctx.lineTo(width - padding, height - padding)
      ctx.lineTo(padding, height - padding)
      ctx.closePath()
      ctx.fillStyle = change7d >= 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"
      ctx.fill()
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [period, extendedData, change7d])

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <div>
          {hoverPrice ? (
            <div className="text-2xl font-bold">{formatCurrency(hoverPrice)}</div>
          ) : (
            <div className="text-2xl font-bold">{formatCurrency(data[data.length - 1])}</div>
          )}
        </div>
        <TabsList>
          <TabsTrigger
            value="24h"
            onClick={() => setPeriod("24h")}
            className={period === "24h" ? "bg-primary text-primary-foreground" : ""}
          >
            24h
          </TabsTrigger>
          <TabsTrigger
            value="7d"
            onClick={() => setPeriod("7d")}
            className={period === "7d" ? "bg-primary text-primary-foreground" : ""}
          >
            7d
          </TabsTrigger>
          <TabsTrigger
            value="30d"
            onClick={() => setPeriod("30d")}
            className={period === "30d" ? "bg-primary text-primary-foreground" : ""}
          >
            30d
          </TabsTrigger>
          <TabsTrigger
            value="1y"
            onClick={() => setPeriod("1y")}
            className={period === "1y" ? "bg-primary text-primary-foreground" : ""}
          >
            1y
          </TabsTrigger>
        </TabsList>
      </div>
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
    </div>
  )
}
