import React, { useEffect } from 'react';
import api from '../api';
import '../styles/Profile.css';
import { ProfileProvider, useProfile } from '../components/Profile/ProfileContent';
import ProfilePicture from '../components/Profile/ProfilePicture';
import Bio from '../components/Profile/Bio';
import FavoriteColors from '../components/Profile/FavoriteColors';
import FavoriteStyles from '../components/Profile/FavoriteStyles';
import BodyMeasurements from '../components/Profile/BodyMeasurements';

const ProfileContent = () => {
    const { 
        profileData, 
        setProfileData, 
        profilePicturePreview, 
        setProfilePicturePreview, 
        setError, 
        error 
    } = useProfile();

    useEffect(() => {
        api.get('/profile/')
            .then(response => {
                const data = response.data;
                if (typeof data.body_measurements === 'string') {
                    data.body_measurements = JSON.parse(data.body_measurements);
                }
                if (typeof data.favorite_colors === 'string') {
                    data.favorite_colors = JSON.parse(data.favorite_colors.replace(/'/g, '"'));
                }
                if (typeof data.favorite_styles === 'string') {
                    data.favorite_styles = JSON.parse(data.favorite_styles.replace(/'/g, '"'));
                }
                setProfileData(data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
                setError('Failed to load profile data. Please try again later.');
            });
    }, [setProfileData, setError]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        for (let key in profileData) {
            if (key === "favorite_styles" || key === "favorite_colors" || key === "body_measurements") {
                formData.append(key, JSON.stringify(profileData[key]));
            } else if (key === "profile_picture" && profileData[key]) {
                formData.append(key, profileData[key]);
            } else if (key !== "profile_picture") {
                formData.append(key, profileData[key]);
            }
        }

        api.put('/profile/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log('Profile updated:', response.data);
                alert('Profile updated successfully.');
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                setError('Failed to update profile. Please try again later.');
            });
    };

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="profile-form-container">
                <ProfilePicture
                    profilePicturePreview={profilePicturePreview}
                    handleChange={(e) => setProfilePicturePreview(URL.createObjectURL(e.target.files[0]))}
                />
                <Bio />
                <FavoriteColors />
                <FavoriteStyles />
                <BodyMeasurements />
                <div className="profile-button-container">
                    <button type="submit">Save Profile</button>
                </div>
            </form>
        </div>
    );
};

const Profile = () => (
    <ProfileProvider>
        <ProfileContent />
    </ProfileProvider>
);

export default Profile;
