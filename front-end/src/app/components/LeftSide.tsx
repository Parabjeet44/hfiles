"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

function Left() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    gender: "Male",
    phone: "",
  });
  const [userId, setUserId] = useState<number | null>(null); // Initially no user selected
  const [isCreatingNewUser, setIsCreatingNewUser] = useState(false);
  const [newUserFormData, setNewUserFormData] = useState({
    email: "",
    gender: "Male",
    phone: "",
  });
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUserId = session?.user?.id;
      if (currentUserId) {
        setUserId(currentUserId); // Store the session ID
        try {
          const response = await axios.get(`http://localhost:5242/api/User/${currentUserId}`);
          const userData = response.data;
          setFormData({
            email: userData.email || "",
            gender: userData.gender || "Male",
            phone: userData.phoneNumber || "",
          });
          setProfileImage(userData.profileImageUrl || "/default-avatar.png");
          setIsCreatingNewUser(false); // If we fetch a user, we are not creating a new one
        } catch (error: any) {
          console.error("Error fetching user profile:", error.message);
          // Optionally handle the error state, e.g., display a message to the user
          setFormData({ email: "", gender: "Male", phone: "" }); // Reset form on error
          setProfileImage(null);
        }
      } else {
        // If no userId in session, reset the form
        setFormData({ email: "", gender: "Male", phone: "" });
        setProfileImage(null);
      }
    };

    fetchUserProfile();
  }, [session]); // Fetch profile when session changes

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewUserChange = (e: any) => {
    const { name, value } = e.target;
    setNewUserFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (file && userId) {
      setProfileImage(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post(`http://localhost:5242/api/User/${userId}/image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setProfileImage(response.data.profileImageUrl); // Update with the server URL
      } catch (error: any) {
        console.error("Error uploading image:", error.message);
        // Optionally handle the error state
      }
    } else if (file && !userId) {
      setProfileImage(URL.createObjectURL(file)); // Just for preview if no user selected yet
    }
  };

  const handleSave = async () => {
    if (userId) {
      try {
        await axios.put(`http://localhost:5242/api/user/${userId}`, {
          email: formData.email,
          gender: formData.gender,
          phoneNumber: formData.phone,
        });
        console.log("Profile updated successfully!");
        // Optionally provide user feedback (e.g., a success message)
      } catch (error: any) {
        console.error("Error updating profile:", error.message);
        // Optionally handle the error state
      }
    } else {
      console.warn("No user ID available to update.");
    }
  };

  const handleCreateNewUser = async () => {
    try {
      const response = await axios.post("http://localhost:5242/api/user", {
        email: newUserFormData.email,
        gender: newUserFormData.gender,
        phoneNumber: newUserFormData.phone,
      });
      console.log("New user created successfully:", response.data);
  
      const newUserId = response.data.id;
  
      const signInResult = await signIn("credentials", {
        redirect: false,
        userId: newUserId.toString(),
      });
  
      if (signInResult?.error) {
        console.error("Error signing in:", signInResult.error);
        alert("Sign-in failed. Please check your credentials.");
      } else {
        console.log("Signed in with ID:", newUserId);
        setUserId(newUserId);
      }
    } catch (error: any) {
      console.error("Error creating new user:", error.message);
      alert("Failed to create a new user. Please try again.");
    }
  };

  const toggleCreateNewUser = () => {
    setIsCreatingNewUser(!isCreatingNewUser);
    setUserId(session?.user?.id || null); // Reset to current session user or null
    setFormData({ email: "", gender: "Male", phone: "" }); // Reset the update form
    setProfileImage(null);
  };

  return (
    <section className="w-[400px] p-6 border-2 border-black rounded-2xl flex flex-col bg-white shadow-md mx-3">
      <h3 className="text-xl font-semibold mb-4 ml-[100px]">
        {isCreatingNewUser ? "➕ Create New User" : "👤 User Profile"}
      </h3>
      <hr className="mb-4" />

      {isCreatingNewUser ? (
        <form className="flex flex-col gap-3">
          <label htmlFor="new-email" className="font-medium">
            Email:
          </label>
          <input
            type="email"
            id="new-email"
            name="email"
            value={newUserFormData.email}
            onChange={handleNewUserChange}
            className="border rounded px-3 py-2"
          />

          <label htmlFor="new-gender" className="font-medium">
            Gender:
          </label>
          <select
            id="new-gender"
            name="gender"
            value={newUserFormData.gender}
            onChange={handleNewUserChange}
            className="border rounded px-3 py-2"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <label htmlFor="new-phone" className="font-medium">
            Phone:
          </label>
          <input
            type="tel"
            id="new-phone"
            name="phone"
            value={newUserFormData.phone}
            onChange={handleNewUserChange}
            className="border rounded px-3 py-2"
          />

          <button
            type="button"
            onClick={handleCreateNewUser}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
          >
            ➕ Create User
          </button>
          <button
            type="button"
            onClick={toggleCreateNewUser}
            className="mt-2 text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div className="flex flex-col items-center mb-4">
            <img
              src={profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
            <input
              className="border-2 border-black rounded-3xl bg-gray-100 pl-2 w-[200px] cursor-pointer"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <form className="flex flex-col gap-3">
            <label htmlFor="email" className="font-medium">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />

            <label htmlFor="gender" className="font-medium">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <label htmlFor="phone" className="font-medium">
              Phone:
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />

            <button
              type="button"
              onClick={handleSave}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              💾 Save Changes
            </button>
          </form>

          <button
            onClick={toggleCreateNewUser}
            className="mt-4 text-green-600 hover:text-green-800 cursor-pointer"
          >
            ➕ Create New User
          </button>
        </>
      )}
    </section>
  );
}

export default Left;