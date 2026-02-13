import { useEffect, useState } from "react";

const API = ""; // your backend Next dev server

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/user/profile`)
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        if (data.profileImage) setPreview(`${API}${data.profileImage}`);
      });
  }, []);

  if (!profile) return <div>Loading...</div>;

  const onChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  async function uploadImageIfNeeded() {
    if (!imageFile) return profile.profileImage;

    const fd = new FormData();
    fd.append("image", imageFile);

    const res = await fetch(`${API}/api/user/upload`, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");

    return data.imageUrl;
  }

  const onSave = async () => {
    setSaving(true);
    try {
      const imageUrl = await uploadImageIfNeeded();

      const res = await fetch(`${API}/api/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          profileImage: imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");

      setProfile(data);
      setImageFile(null);
      alert("Profile saved!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "24px auto" }}>
      <h2>User Profile Management</h2>

      <label>ID</label>
      <input value={profile.id} disabled style={{ width: "100%" }} />

      <label>First Name</label>
      <input name="firstName" value={profile.firstName} onChange={onChange} style={{ width: "100%" }} />

      <label>Last Name</label>
      <input name="lastName" value={profile.lastName} onChange={onChange} style={{ width: "100%" }} />

      <label>Email</label>
      <input name="email" value={profile.email} onChange={onChange} style={{ width: "100%" }} />

      <label>Profile Image</label>
      <input type="file" accept="image/*" onChange={onPickImage} />

      {preview && (
        <div style={{ marginTop: 10 }}>
          <img src={preview} alt="preview" style={{ width: 160, height: 160, objectFit: "cover" }} />
        </div>
      )}

      <button onClick={onSave} disabled={saving} style={{ marginTop: 16, width: "100%" }}>
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
