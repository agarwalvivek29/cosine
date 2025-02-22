import React from 'react';
import { Handle, Position } from 'reactflow';
import { Bell, Mail, Database, Search } from 'lucide-react';

const getNodeIcon = (type) => {
  switch (type) {
    case 'Trigger': return <Bell className="w-6 h-6" />;
    case 'ChannelSend': return <Mail className="w-6 h-6" />;
    case 'SaveToDatabase': return <Database className="w-6 h-6" />;
    case 'GetFromDatabase': return <Search className="w-6 h-6" />;
    default: return null;
  }
};

const CustomNode = ({ data, isConnectable }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex items-center">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-stone-100">
          {getNodeIcon(data.iconType)}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500">{data.type}</div>
        </div>
      </div>
      {data.details && (
        <div className="mt-2 text-sm text-gray-700">
          {Object.entries(data.details).map(([key, value]) => (
            <div key={key}>
              <span className="font-semibold">{key}:</span> {value}
            </div>
          ))}
        </div>
      )}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export { CustomNode };
