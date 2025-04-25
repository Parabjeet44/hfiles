"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

function Right() {
  const [fileType, setFileType] = useState("Lab Report");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: session } = useSession();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!fileName || !selectedFile || userId === null) {
      alert("Please enter file name, choose a file, and ensure you are logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("fileType", fileType);
    formData.append("fileName", fileName);
    formData.append("file", selectedFile);
    formData.append("userId", userId.toString()); // Send the userId

    try {
      const response = await fetch("http://localhost:5242/api/file/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("File uploaded successfully!");
        setFileName("");
        setSelectedFile(null);
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };

  return (
    <section className="w-[400px] p-6 border-2 border-black rounded-2xl flex flex-col bg-white shadow-md">
      <h3 className="text-xl font-semibold mb-4">📂 Upload Medical File</h3>
      <form className="flex flex-col gap-3">
        <label className="font-medium">File Type:</label>
        <select
          className="border rounded px-3 py-2"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <option>Lab Report</option>
          <option>Prescription</option>
          <option>X-Ray</option>
          <option>Blood Report</option>
          <option>MRI Scan</option>
          <option>CT Scan</option>
        </select>

        <label className="font-medium">File Name:</label>
        <input
          type="text"
          className="border rounded px-3 py-2"
          placeholder="e.g. Ankit’s Lab Report"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />

        <label className="font-medium">Choose File:</label>
        <input
          className="border-2 border-black rounded-2xl pl-2 w-[200px] cursor-pointer bg-gray-100"
          type="file"
          accept=".pdf, image/*"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
        >
          📤 Submit
        </button>
      </form>
    </section>
  );
}

export default Right;