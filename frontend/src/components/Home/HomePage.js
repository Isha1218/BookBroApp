import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="bg-black h-[200px] flex flex-col justify-center items-center">
        <p className="text-7xl text-center text-blue-400">hi</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Go to Epub Viewer
        </button>
      </div>
    </div>
  );
};

export default HomePage;
