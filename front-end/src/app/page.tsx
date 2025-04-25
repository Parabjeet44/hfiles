import React from "react";
import Header from "./components/Header";
import Left from "./components/LeftSide";
import Right from "./components/RightSide";
import UploadedFiles from "./components/UploadedFiles";

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen">
      <Header />
      <div className="flex flex-col lg:flex-row justify-center gap-10 p-10 bg-gray-50 min-h-screen">
        <Left />
        <Right />
      </div>
      <UploadedFiles />
    </div>
  );
}