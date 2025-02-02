"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
}

export default function ProfilePage() {
  const { signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "A short bio about John Doe.",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="p-6 space-y-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Profile</h1>
      <p className="text-gray-600 dark:text-gray-300">Manage yours profile information</p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            className="p-2 border rounded w-full dark:bg-gray-800 dark:text-white"
          />
        </div>
        <button className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          Update Profile
        </button>
        <button
          onClick={() => signOut()}
          className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition mt-4"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
} 