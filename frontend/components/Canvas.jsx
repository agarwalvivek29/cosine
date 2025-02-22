"use client"

import { useRef, useEffect } from "react"

const Canvas = ({ nodes, connections, updateNodePosition, addConnection }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    ctx.strokeStyle = "#00FF00"
    connections.forEach(({ from, to }) => {
      const fromNode = nodes.find((node) => node.id === from)
      const toNode = nodes.find((node) => node.id === to)
      if (fromNode && toNode) {
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.stroke()
      }
    })

    // Draw nodes
    nodes.forEach((node) => {
      ctx.fillStyle = "#00FF00"
      ctx.strokeStyle = "#00FF00"
      switch (node.type) {
        case "rectangle":
          ctx.strokeRect(node.x, node.y, 80, 40)
          break
        case "diamond":
          ctx.beginPath()
          ctx.moveTo(node.x, node.y - 20)
          ctx.lineTo(node.x + 40, node.y)
          ctx.lineTo(node.x, node.y + 20)
          ctx.lineTo(node.x - 40, node.y)
          ctx.closePath()
          ctx.stroke()
          break
        case "circle":
          ctx.beginPath()
          ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI)
          ctx.stroke()
          break
      }
    })
  }, [nodes, connections])

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const clickedNode = nodes.find(
      (node) => x >= node.x - 40 && x <= node.x + 40 && y >= node.y - 20 && y <= node.y + 20,
    )
    if (clickedNode) {
      const moveNode = (moveEvent) => {
        updateNodePosition(clickedNode.id, moveEvent.clientX - rect.left, moveEvent.clientY - rect.top)
      }
      const stopMoving = () => {
        canvas.removeEventListener("mousemove", moveNode)
        canvas.removeEventListener("mouseup", stopMoving)
      }
      canvas.addEventListener("mousemove", moveNode)
      canvas.addEventListener("mouseup", stopMoving)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width="100%"
      style={{ width: '100%', height: 400 }}
      height={400}
      className="border border-green-700 bg-black"
      onMouseDown={handleMouseDown}
    />
  )
}

export default Canvas

