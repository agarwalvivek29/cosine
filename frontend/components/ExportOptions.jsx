const ExportOptions = ({ nodes, connections }) => {
  const exportASCII = () => {
    // Implement ASCII export logic
    console.log("Exporting as ASCII");
  };

  const exportSVG = () => {
    // Implement SVG export logic
    console.log("Exporting as SVG");
  };

  const exportPNG = () => {
    // Implement PNG export logic
    console.log("Exporting as PNG");
  };

  return (
    <div className="mt-4 flex space-x-2">
      <button onClick={exportASCII} className="bg-blue-700 text-blue-100 px-4 py-2 rounded">
        Export ASCII
      </button>
      <button onClick={exportSVG} className="bg-blue-700 text-blue-100 px-4 py-2 rounded">
        Export SVG
      </button>
      <button onClick={exportPNG} className="bg-blue-700 text-blue-100 px-4 py-2 rounded">
        Export PNG
      </button>
    </div>
  );
};

export default ExportOptions;