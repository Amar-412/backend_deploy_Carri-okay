import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function ProfileModal({ isOpen, onClose }) {
  const { token, currentUser, setCurrentUser } = useAuth();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    if (!isOpen) {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      setFile(null);
      setIsUploading(false);
    }
  }, [isOpen, preview]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file || !token || isUploading) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8080/api/profile/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      let payload = {};
      try {
        payload = await response.json();
      } catch {
        payload = {};
      }

      if (!response.ok) {
        throw new Error(payload?.message || "Failed to upload profile image");
      }

      const updatedUser = payload?.user && typeof payload.user === "object" ? payload.user : payload;
      setCurrentUser((previous) => ({
        ...(previous || {}),
        ...(updatedUser || {})
      }));
      onClose();
    } catch (error) {
      // Keep existing UX style simple and consistent.
      window.alert(error.message || "Failed to upload profile image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="drawer-overlay profile-modal-overlay" onClick={onClose}>
      <div
        className="profile-modal-panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <div className="profile-modal-header">
          <h2 className="profile-modal-title" id="profile-modal-title">Edit Profile</h2>
          <button className="profile-modal-close" onClick={onClose} aria-label="Close edit profile modal">
            ×
          </button>
        </div>

        <div className="profile-modal-content">
          <p className="profile-modal-subtitle">Update your profile image</p>
          <div className="profile-avatar-preview">
            {preview ? (
              <img src={preview} alt="Profile preview" className="avatar-img" />
            ) : currentUser?.profileImage ? (
              <img
                src={`http://localhost:8080${currentUser.profileImage}`}
                alt={`${currentUser?.name || "User"} profile`}
                className="avatar-img"
              />
            ) : (
              <div className="user-avatar">
                {(currentUser?.name || "?").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-upload-group">
            <label htmlFor="profile-image-input" className="profile-upload-label">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="profile-file-input"
              id="profile-image-input"
            />
            <label htmlFor="profile-image-input" className="btn btn-outline profile-upload-trigger">
              Choose Image
            </label>
          </div>

          <div className="profile-modal-actions">
            <button type="button" className="btn btn-outline profile-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-secondary profile-save-btn"
              onClick={handleUpload}
              disabled={!file || isUploading}
            >
              {isUploading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
