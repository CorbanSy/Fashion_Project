import React from 'react';
import { useProfile } from '../../components/Profile/ProfileContent';

const Bio = () => {
    const { profileData, setProfileData } = useProfile();

    const handleChange = (e) => {
        setProfileData({ ...profileData, bio: e.target.value });
    };

    return (
        <div className="form-group bio-container">
            <label>Bio</label>
            <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleChange}
            ></textarea>
        </div>
    );
};

export default Bio;
