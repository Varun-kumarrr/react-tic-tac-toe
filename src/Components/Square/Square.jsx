function Square({ value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-200 border-2 border-gray-300 text-2xl w-20 h-20
      font-bold text-gray-800 cursor-pointer rounded-lg transition-all duration-200 ease-in-out hover:bg-gray-300"
    >
      {value}
    </button>
  );
}

export default Square;
