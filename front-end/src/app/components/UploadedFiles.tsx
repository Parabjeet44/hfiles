"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

function UploadedFiles() {
  const [files, setFiles] = useState<
    { id: number; fileName: string; fileType: string; fileUrl: string; uploadedAt: string }[]
  >([]);
  const { data: session } = useSession();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
      fetchUploadedFiles(session.user.id);
    }
  }, [session]);

  const fetchUploadedFiles = async (userId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:5242/api/file/user/${userId}`
      );
      setFiles(response.data);
    } catch (error: any) {
      console.error("Error fetching uploaded files:", error.message);
      alert("Failed to load uploaded files.");
    }
  };

  const handleView = (url: string) => window.open(url, "_blank");

  const handleDelete = async (id: number) => {
    if (confirm("Delete this file?")) {
      try {
        const response = await axios.delete(`http://localhost:5242/api/file/${id}`);
        if (response.data?.message === "File deleted successfully") {
          setFiles((prev) => prev.filter((f) => f.id !== id));
          alert("File deleted successfully!");
        } else {
          alert("Failed to delete the file.");
        }
      } catch (error: any) {
        console.error("Error deleting file:", error.message);
        alert("Failed to delete the file.");
      }
    }
  };

  if (!userId) {
    return <p className="text-center mt-10">Please log in to view your uploaded files.</p>;
  }

  return (
    <section className="w-full flex justify-center mt-10">
      <div className="w-full max-w-6xl px-6">
        <h3 className="text-2xl font-bold mb-6 text-center">Uploaded Files</h3>
        {files.length === 0 ? (
          <p className="text-center">No files have been uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition duration-300"
              >
                <div className="h-40 flex items-center justify-center bg-gray-100">
                  {file.fileUrl.endsWith(".pdf") ? (
                    <div className="text-gray-500 text-sm">PDF Preview</div>
                  ) : (
                    <img
                      src={`http://localhost:5242${file.fileUrl}`} // Ensure correct URL
                      alt={file.fileName}
                      className="object-contain max-h-full"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg">{file.fileName}</h4>
                  <p className="text-sm text-gray-500 mb-3">{file.fileType}</p>
                  <p className="text-xs text-gray-400 mb-2">
                    Uploaded At: {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(`http://localhost:5242${file.fileUrl}`)} // Ensure correct URL
                      className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="px-4 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default UploadedFiles;