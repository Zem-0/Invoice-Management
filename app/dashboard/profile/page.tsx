"use client";

import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { createClient } from '@supabase/supabase-js';
import { 
  IconUser, 
  IconMail, 
  IconBook, 
  IconLogout, 
  IconCamera,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMapPin,
  IconDeviceFloppy
} from "@tabler/icons-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserProfile {
  clerk_id: string;
  name: string | null;
  email: string | null;
  bio: string | null;
}

export default function ProfilePage() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user) return;
    
    // Fetch or create profile
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select()
        .eq('clerk_id', user.id)
        .single();

      if (data) {
        setProfile(data);
      } else {
        setProfile({
          clerk_id: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress || null,
          bio: null
        });
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select()
      .eq('clerk_id', profile.clerk_id)
      .single();

    let error;
    
    if (existingProfile) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          email: profile.email,
          bio: profile.bio
        })
        .eq('clerk_id', profile.clerk_id);
      error = updateError;
    } else {
      // Insert new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([profile]);
      error = insertError;
    }

    if (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } else {
      alert('Profile saved successfully!');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (!profile) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            Profile Settings
          </h1>
          <p className="text-zinc-400 mt-2">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <motion.div 
            className="md:col-span-1 space-y-6 bg-zinc-900/50 p-8 rounded-2xl border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-center space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 p-1">
                  <img
                    src={user?.imageUrl}
                    alt={profile.name || 'Profile'}
                    className="w-full h-full rounded-full object-cover bg-black"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-white font-medium">{profile.name}</h3>
                <p className="text-zinc-400 text-sm">{profile.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Main Form Section */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-8 rounded-2xl border border-white/10">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-zinc-400 mb-2">
                    <IconUser className="w-4 h-4 mr-2" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-zinc-400 mb-2">
                    <IconMail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-zinc-400 mb-2">
                    <IconBook className="w-4 h-4 mr-2" />
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profile.bio ?? ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50"
                >
                  <IconDeviceFloppy className="w-4 h-4" />
                  Save Changes
                </motion.button>
                
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => signOut()}
                  className="px-8 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <IconLogout className="w-4 h-4" />
                  Sign Out
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 