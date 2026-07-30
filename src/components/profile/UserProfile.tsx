import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfile.css';
import { TimelineItem, UserProfile as UserProfileType, UserProfileProps } from '../../interfaces/interfaces';
import { API_URLS } from '../../config/api';
import TimelineCard from '../cards/TimeLineCard';
import { normalizeTags } from '../../utils/categoryUtils';
import { sortTimelineItems } from '../../utils/dateUtils';

const UserProfileComponent: React.FC<UserProfileProps> = ({ currentUser }) => {
  const { username: paramUsername } = useParams<{ username?: string }>();
  
  // Determine target username (from URL parameter or logged-in user)
  const targetUsername = paramUsername || currentUser?.username || currentUser?.name || 'admin';
  const isOwnProfile =
    currentUser &&
    (currentUser.username?.toLowerCase() === targetUsername.toLowerCase() ||
      currentUser.name?.toLowerCase() === targetUsername.toLowerCase());

  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [userPosts, setUserPosts] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState<UserProfileType>({
    username: targetUsername,
    full_name: currentUser?.name || targetUsername,
    email: currentUser?.email || '',
    bio: '',
    avatar_url: '',
    role: 'Contributor',
  });

  // 1. Fetch Profile by username
  useEffect(() => {
    setLoading(true);
    setErrorMsg('');

    fetch(API_URLS.USER_PROFILE(targetUsername))
      .then((res) => {
        if (!res.ok) throw new Error('Profile not found');
        return res.json();
      })
      .then((data) => {
        const loadedProfile = data.profile || data;
        setProfile(loadedProfile);
        setFormData(loadedProfile);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Backend profile fetch notice:', err.message);
        // Fallback default profile if not found on server
        const fallback: UserProfileType = {
          username: targetUsername,
          full_name: currentUser?.name || targetUsername,
          email: currentUser?.email || `${targetUsername}@example.com`,
          bio: 'Political Analyst & Fact Checker',
          avatar_url: '',
          role: 'Contributor',
        };
        setProfile(fallback);
        setFormData(fallback);
        setLoading(false);
      });
  }, [targetUsername, currentUser]);

  // 2. Fetch posts belonging to this user
  useEffect(() => {
    fetch(API_URLS.TIMELINE)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data
            .filter(
              (item: any) =>
                (item.username || '').toLowerCase() === targetUsername.toLowerCase()
            )
            .map((item: any) => ({
              ...item,
              tags: normalizeTags(item.tags),
            }));
          setUserPosts(sortTimelineItems(filtered));
        }
      })
      .catch((err) => console.error('Failed to load user posts:', err));
  }, [targetUsername]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile changes via PUT /api/userprofile/:username (or POST if creating)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');

    try {
      // First attempt PUT /api/userprofile/:username
      let res = await fetch(API_URLS.USER_PROFILE(targetUsername), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // If PUT fail / 404, fallback to POST /api/userprofile
      if (!res.ok && res.status === 404) {
        res = await fetch(API_URLS.USER_PROFILES, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        const responseData = await res.json();
        const updated = responseData.profile || formData;
        setProfile(updated);
        setIsEditing(false);
      } else {
        // Optimistic local update if server is mock endpoint
        setProfile(formData);
        setIsEditing(false);
      }
    } catch (err) {
      console.warn('Failed backend update, updating local state:', err);
      setProfile(formData);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="timeline-loading-container">
        <div className="timeline-spinner" aria-label="Loading profile" />
        <span className="timeline-loading-text">Loading profile...</span>
      </div>
    );
  }

  const initialLetter = (profile?.full_name || profile?.username || 'U')
    .charAt(0)
    .toUpperCase();

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Banner Cover Header */}
        <div className="profile-banner" />

        <div className="profile-header-content">
          <div className="profile-avatar-wrapper">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || profile.username}
                className="profile-avatar-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="profile-avatar-fallback">{initialLetter}</div>
            )}

            {isOwnProfile && !isEditing && (
              <button
                className="profile-action-btn"
                onClick={() => setIsEditing(true)}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>

          {!isEditing ? (
            /* Profile View Mode */
            <div className="profile-info">
              <div className="profile-name-row">
                <h1 className="profile-fullname">
                  {profile?.full_name || profile?.username}
                </h1>
                {profile?.role && (
                  <span className="profile-role-badge">{profile.role}</span>
                )}
              </div>

              <div className="profile-username">@{profile?.username}</div>

              {profile?.email && isOwnProfile && (
                <div className="profile-email">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {profile.email}
                </div>
              )}

              {profile?.bio && <p className="profile-bio">{profile.bio}</p>}
            </div>
          ) : (
            /* Profile Edit Mode Form */
            <form className="profile-edit-form" onSubmit={handleSaveProfile}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                Edit Profile Information
              </h2>

              {errorMsg && <div className="auth-error">{errorMsg}</div>}

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    className="auth-input"
                    style={{ paddingLeft: '0.875rem' }}
                    value={formData.full_name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    name="role"
                    className="auth-input"
                    style={{ paddingLeft: '0.875rem' }}
                    value={formData.role || 'Contributor'}
                    onChange={handleInputChange}
                  >
                    <option value="Contributor">Contributor</option>
                    <option value="Fact Checker">Fact Checker</option>
                    <option value="Editor">Editor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Avatar Image URL</label>
                <input
                  type="url"
                  name="avatar_url"
                  className="auth-input"
                  style={{ paddingLeft: '0.875rem' }}
                  value={formData.avatar_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  className="timeline-textarea-description"
                  value={formData.bio || ''}
                  onChange={handleInputChange}
                  placeholder="Tell us about your analytical focus or background..."
                  rows={3}
                />
              </div>

              <div className="profile-form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-action-btn"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* User's Published Timeline Posts */}
      <div className="user-posts-section">
        <h2 className="section-title">Posts by @{targetUsername}</h2>
        {userPosts.length > 0 ? (
          <div className="timeline-wrapper">
            {userPosts.map((item, index) => (
              <TimelineCard
                key={item.id}
                data={item}
                isLast={index === userPosts.length - 1}
                onUpdate={(updated) => {
                  setUserPosts((prev) =>
                    prev.map((p) => (p.id === updated.id ? updated : p))
                  );
                }}
                isAuthenticated={!!currentUser}
                currentUser={currentUser}
              />
            ))}
          </div>
        ) : (
          <div className="empty-posts-notice">
            No published posts found for @{targetUsername}.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileComponent;
