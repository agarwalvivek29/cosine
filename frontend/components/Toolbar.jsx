const Toolbar = ({ addNode }) => {
  return (
    <div className="mb-4 flex space-x-2">
      <button onClick={() => addNode("rectangle")} className="bg-green-700 text-green-100 px-4 py-2 rounded">
        Rectangle
      </button>
      <button onClick={() => addNode("diamond")} className="bg-green-700 text-green-100 px-4 py-2 rounded">
        Diamond
      </button>
      <button onClick={() => addNode("circle")} className="bg-green-700 text-green-100 px-4 py-2 rounded">
        Circle
      </button>
    </div>
  );
};

export default Toolbar;