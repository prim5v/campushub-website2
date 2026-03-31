import { useEffect, useState } from "react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLandlord } from "@/contexts/LandlordContext";
import { useLocation } from "wouter";
import ApiSocket from "@/utils/ApiSocket";
import PageTracker from "../PageTracker";

export default function FullProfile() {
  const { profile, refreshProfile } = useLandlord();
  const [, setLocation] = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    full_name: "",
    id_number: "",
    profile_picture: null, // store new profile picture file
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);

  // Load profile into form
  useEffect(() => {
    if (!profile) return;

    setForm({
      username: profile.username || "",
      email: profile.email || "",
      phone: profile.phone || "",
      full_name: profile.verification?.full_name || "",
      id_number: profile.verification?.id_number || "",
      profile_picture: profile.profile_picture || null,
    });

    console.log("Loaded profile into form:", profile);

    setPreviewAvatar(profile.profile_picture || null); // existing profile picture
  }, [profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, profile_picture: file });
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("phone", form.phone || "");
      formData.append("full_name", form.full_name || "");
      formData.append("id_number", form.id_number || "");
      formData.append("username", form.username || ""); // include username for completeness
      if (form.profile_picture) {
        formData.append("profile_picture", form.profile_picture);
      }

      // const res = await ApiSocket.put("/landlord/post_profile", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      const res = await ApiSocket.put("/landlord/post_profile", formData);
      console.log("Profile update response:", res);
      console.log("Form data sent:", {
        phone: form.phone,
        full_name: form.full_name,
        id_number: form.id_number,
        profile_picture: form.profile_picture,
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully");
      setIsEditing(false);
      setForm({ ...form, profile_picture: null });

      // Refresh profile from backend
      await refreshProfile();

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <div className="p-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <PageTracker page="Landlord profile"/>
          <CardTitle>My Profile</CardTitle>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">

          {error && (
            <div className="p-3 rounded bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded bg-green-100 text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* ===== AVATAR ===== */}
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
              {previewAvatar ? (
                <img
                  src={previewAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-500">
                  {profile.username?.[0] || "U"}
                </span>
              )}
            </div>

            {isEditing && (
              <div>
                <Label>Change Avatar</Label>
                <Input type="file" accept="image/*" onChange={handleAvatarChange} />
              </div>
            )}
          </div>

          {/* ===== BASIC INFO ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Username</Label>
              <Input
              name="username"
              value={form.username}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter username"
            />
                
            </div>

            <div>
              <Label>Email (not editable)</Label>
              <Input value={form.email} disabled />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <Label>Account Status</Label>
              <div className="pt-2">
                <Badge variant={profile.is_active ? "default" : "destructive"}>
                  {profile.is_active ? "Active" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>

          {/* ===== VERIFICATION ===== */}
          <div className="pt-4 border-t space-y-4">
            <h3 className="font-semibold">Verification Info</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your legal name"
                />
              </div>

              <div>
                <Label>ID Number</Label>
                <Input
                  name="id_number"
                  value={form.id_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="National ID / Passport"
                />
              </div>

              <div>
                <Label>Verification Status</Label>
                <div className="pt-2">
                  <Badge
                    className={
                      profile.verification?.status === "verified"
                        ? "bg-green-600"
                        : ""
                    }
                  >
                    {profile.verification?.status || "pending"}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Verification Type</Label>
                <Input
                  value={profile.verification?.check_type || "-"}
                  disabled
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button variant="ghost" onClick={() => setLocation("/landlord-dashboard")}>
        ← Back to Dashboard
      </Button>
    </div>
  );
}
