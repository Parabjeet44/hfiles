"use client";
import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

function Header() {
  const { data: session } = useSession();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      const fetchProfileImage = async () => {
        try {
          const response = await fetch(
            `http://localhost:5242/api/User/${session.user.id}`
          );
          if (response.ok) {
            const userData = await response.json();
            setProfileImageUrl(userData.profileImageUrl);
          } else {
            console.error("Failed to fetch user profile for image.");
          }
        } catch (error) {
          console.error("Error fetching user profile image:", error);
        }
      };
      fetchProfileImage();
    }
  }, [session]);

  return (
    <header>
      <nav className="flex flex-col md:flex-row items-center text-white bg-blue-500 py-5 text-xl md:text-2xl">
        <p className="mx-4">HFiles Logo</p>
        <p className="mx-0 md:mx-[525px] text-center">HFiles DashBoard</p>
        <div className="border-2 border-black rounded-full mx-auto w-10 h-10 overflow-hidden">
          {profileImageUrl ? (
            <Image
              src={`http://localhost:5242${profileImageUrl}`}
              alt="Profile"
              width={40} // Match the container width
              height={40} // Match the container height
              objectFit="cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              {/* You can put a default avatar icon or text here */}
              👤
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;