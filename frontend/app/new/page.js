"use client"

import { useState } from "react"
import Canvas from "@/components/Canvas.jsx"
import Toolbar from "@/components/Toolbar.jsx"
import ExportOptions from "@/components/ExportOptions.jsx"

export default function Home() {
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])

  const addNode = (type) => {
    setNodes([...nodes, { id: Date.now(), type, x: 100, y: 100 }])
  }

  const updateNodePosition = (id, x, y) => {
    setNodes(nodes.map((node) => (node.id === id ? { ...node, x, y } : node)))
  }

  const addConnection = (from, to) => {
    setConnections([...connections, { from, to }])
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black text-green-400 font-mono">
      <div className="w-full max-w-4xl bg-gray-900 p-4 rounded-lg shadow-lg">
        <Toolbar addNode={addNode} />
        <Canvas
          nodes={nodes}
          connections={connections}
          updateNodePosition={updateNodePosition}
          addConnection={addConnection}
        />
        <ExportOptions nodes={nodes} connections={connections} />
      </div>
    </main>
  )
}