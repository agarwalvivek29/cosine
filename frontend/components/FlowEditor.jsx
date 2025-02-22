'use client'

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomNode } from './CustomNodes';
import { Bell, Mail, Database, Search } from 'lucide-react';

const nodeTypeOptions = ['Trigger', 'ChannelSend', 'SaveToDatabase', 'GetFromDatabase'];

const getNodeIcon = (type) => {
  switch (type) {
    case 'Trigger': return <Bell className="w-6 h-6" />;
    case 'ChannelSend': return <Mail className="w-6 h-6" />;
    case 'SaveToDatabase': return <Database className="w-6 h-6" />;
    case 'GetFromDatabase': return <Search className="w-6 h-6" />;
    default: return null;
  }
};

const initialNodes = [
  { id: '1', type: 'customNode', position: { x: 0, y: 0 }, data: { label: 'Trigger', type: 'Trigger', iconType: 'Trigger', details: { condition: 'New user registered' } } },
];

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [jsonRepresentation, setJsonRepresentation] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addNode = (type) => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: 'customNode',
      data: { label: type, type: type, iconType: type, details: {} },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const updateJson = () => {
    const flowJson = JSON.stringify({ nodes, edges }, null, 2);
    setJsonRepresentation(flowJson);
  };

  const loadFromJson = () => {
    try {
      const flowData = JSON.parse(jsonRepresentation);
      if (flowData.nodes && flowData.edges) {
        const updatedNodes = flowData.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            icon: getNodeIcon(node.data.iconType)
          }
        }));
        setNodes(updatedNodes);
        setEdges(flowData.edges);
      }
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const updateNodeData = (id, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const updatedData = { 
            ...node.data, 
            ...newData, 
            details: { ...node.data.details, ...newData.details },
            icon: getNodeIcon(newData.type || node.data.type)
          };
          return { ...node, data: updatedData };
        }
        return node;
      })
    );
    setSelectedNode(null);
  };

  const deleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  }, [setNodes, setEdges]);

  return (
    <div className="h-screen flex">
      <div className="w-3/4 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
      <div className="w-1/4 p-4 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {nodeTypeOptions.map((type) => (
            <Button key={type} onClick={() => addNode(type)} className="flex-grow">
              Add {type}
            </Button>
          ))}
        </div>
        <Button onClick={updateJson}>Update JSON</Button>
        <Button onClick={loadFromJson}>Load from JSON</Button>
        <Textarea
          value={jsonRepresentation}
          onChange={(e) => setJsonRepresentation(e.target.value)}
          placeholder="JSON representation"
          className="h-full"
        />
      </div>
      {selectedNode && (
        <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Node: {selectedNode.data.label}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  defaultValue={selectedNode.data.label}
                  className="col-span-3"
                  onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                />
              </div>
              {selectedNode.data.type === 'Trigger' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="condition" className="text-right">
                    Condition
                  </Label>
                  <Input
                    id="condition"
                    defaultValue={selectedNode.data.details.condition}
                    className="col-span-3"
                    onChange={(e) => updateNodeData(selectedNode.id, { details: { condition: e.target.value } })}
                  />
                </div>
              )}
              {selectedNode.data.type === 'ChannelSend' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="medium" className="text-right">
                      Medium
                    </Label>
                    <Input
                      id="medium"
                      defaultValue={selectedNode.data.details.medium}
                      className="col-span-3"
                      onChange={(e) => updateNodeData(selectedNode.id, { details: { ...selectedNode.data.details, medium: e.target.value } })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="field" className="text-right">
                      Field
                    </Label>
                    <Input
                      id="field"
                      defaultValue={selectedNode.data.details.field}
                      className="col-span-3"
                      onChange={(e) => updateNodeData(selectedNode.id, { details: { ...selectedNode.data.details, field: e.target.value } })}
                    />
                  </div>
                </>
              )}
              {(selectedNode.data.type === 'SaveToDatabase' || selectedNode.data.type === 'GetFromDatabase') && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="query" className="text-right">
                    Query
                  </Label>
                  <Input
                    id="query"
                    defaultValue={selectedNode.data.details.query}
                    className="col-span-3"
                    onChange={(e) => updateNodeData(selectedNode.id, { details: { query: e.target.value } })}
                  />
                </div>
              )}
              <Button onClick={() => deleteNode(selectedNode.id)} variant="destructive">
                Delete Node
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}