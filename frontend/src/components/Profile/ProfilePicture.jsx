import React from 'react';
import { useProfile } from './ProfileContent';

const ProfilePicture = () => {
    const { profilePicturePreview, setProfilePicturePreview } = useProfile();

    const handleChange = (e) => {
        setProfilePicturePreview(URL.createObjectURL(e.target.files[0]));
    };

    return (
        <div className="form-group profile-picture-container">
            <label>Profile Picture</label>
            <input type="file" name="profile_picture" onChange={handleChange} />
            {profilePicturePreview && <img src={profilePicturePreview} alt="Profile Preview" className="profile-picture-preview" />}
        </div>
    );
};

export default ProfilePicture;
