// src/pages/comrade/Profile.jsx
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LogOut, Settings, User, Mail, Shield, Camera, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import PageTracker from "../../components/PageTracker";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [, setLocation] = useLocation();

  const [form, setForm] = useState({
    username: user?.username || "",
  });

  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || null);

  if (!user) {
    return <div className="p-10 text-center">No user logged in.</div>;
  }

  // Upload avatar
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove avatar
  const removeAvatar = () => {
    setPreviewAvatar(null);
  };

  const handleSave = () => {
    setUser({ ...user, ...form, avatar: previewAvatar });
    setEditMode(false);
  };

  const handleLogout = () => {
    logout();
    setLocation("/"); // redirect to home
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTracker page="Profile"/>

      <div className="pt-32 pb-20 flex justify-center px-4">
        <div className="w-full max-w-3xl space-y-6">

          {/* ===== PROFILE HEADER ===== */}
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">

              {/* Avatar */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary bg-primary/10 flex items-center justify-center">
                  {previewAvatar ? (
                    <img
                      src={previewAvatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-primary" />
                  )}
                </div>

                {/* Hover actions */}
                {editMode && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
                    <label className="cursor-pointer">
                      <Camera className="text-white w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleAvatarUpload}
                      />
                    </label>

                    {previewAvatar && (
                      <button onClick={removeAvatar}>
                        <Trash2 className="text-white w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Identity */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className="text-muted-foreground">{user.email}</p>

                <div>
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                </div>
              </div>

              {/* Action */}
              <div>
                {!editMode ? (
                  <Button onClick={() => setEditMode(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>

          {/* ===== INFO SECTION ===== */}
          <Card className="border-border/50">
            <CardHeader className="font-semibold">Account Information</CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">

              {/* Username */}
              <InfoRow
                icon={<User className="w-4 h-4" />}
                label="Username"
                value={
                  editMode ? (
                    <Input
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                    />
                  ) : (
                    user.username
                  )
                }
              />

              {/* Email (NOT EDITABLE) */}
              <InfoRow
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={
                  <span className="text-muted-foreground select-none">
                    {user.email}
                  </span>
                }
              />

              {/* Role */}
              <InfoRow
                icon={<Shield className="w-4 h-4" />}
                label="Role"
                value={<span className="capitalize">{user.role}</span>}
              />

            </CardContent>
          </Card>

          {/* ===== DANGER ZONE ===== */}
          <Card className="border-destructive/30">
            <CardHeader className="flex items-center gap-2 text-destructive">
              <Settings className="w-5 h-5" />
              Account Actions
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full justify-start gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ===== SMALL COMPONENT ===== */
function InfoRow({ icon, label, value }) {
  return (
    <div className="p-4 rounded-lg border border-border/50 bg-card flex gap-3 items-start">
      <div className="mt-1 text-muted-foreground">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
