import { useState } from "react";
import { FiUser, FiLock, FiX } from "react-icons/fi";
import PasswordInput from "../Input/PasswordInput";
import axiosInstance from "../../utils/axiosInstance";

export function ProfilePanel({ userInfo, onClose, onSaved, showToastMessage }) {
  const [fullName, setFullName] = useState(userInfo?.fullName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const saveProfile = async (event) => {
    event.preventDefault();
    const trimmedName = fullName.trim();
    const isChangingPassword = currentPassword || newPassword;

    if (!trimmedName) return setError("Name cannot be empty");
    if (isChangingPassword && (!currentPassword || !newPassword)) return setError("Enter both current and new passwords");
    if (newPassword && newPassword.length < 8) return setError("New password must be at least 8 characters");

    const payload = {};
    if (trimmedName !== userInfo.fullName) payload.fullName = trimmedName;
    if (isChangingPassword) Object.assign(payload, { currentPassword, newPassword });
    if (Object.keys(payload).length === 0) return onClose();

    try {
      setIsSaving(true);
      const response = await axiosInstance.patch("/update-profile", payload);
      onSaved(response.data.user);
      showToastMessage("Profile updated successfully", "success");
      setCurrentPassword("");
      setNewPassword("");
      onClose();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update profile. Please try again.");
      showToastMessage("Unable to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="profile-panel" onSubmit={saveProfile}>
      <header className="profile-panel__header">
        <div>
          <p className="profile-panel__eyebrow">ACCOUNT SETTINGS</p>
          <h2 className="profile-panel__title">Your profile</h2>
        </div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close profile settings" title="Close"><FiX aria-hidden="true" /></button>
      </header>

      <section className="profile-panel__section">
        <h3><FiUser aria-hidden="true" /> Profile</h3>
        <label className="form-label" htmlFor="profile-name">DISPLAY NAME</label>
        <input id="profile-name" className="form-input" value={fullName} onChange={(event) => setFullName(event.target.value)} />
      </section>

      <section className="profile-panel__section">
        <h3><FiLock aria-hidden="true" /> Change password</h3>
        <p className="profile-panel__hint">Enter your current password to set a new one.</p>
        <PasswordInput value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Current password" />
        <PasswordInput value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="New password (8+ characters)" />
      </section>

      {error && <p className="form-error">{error}</p>}
      <footer className="profile-panel__footer">
        <button className="button button--secondary" type="button" onClick={onClose}>Cancel</button>
        <button className="button button--primary" type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save profile"}</button>
      </footer>
    </form>
  );
}
