


function ReSetButton({onClick}) {
   
    return (
        <button className="px-5 py-2 text-base border-0 bg-green-600 text-white rounded-md cursor-pointer transition-colors duration-300 ease-in-out hover:bg-green-700"
        onClick={onClick}
        >Reset</button>
    );
}
export default ReSetButton;