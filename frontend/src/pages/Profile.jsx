import React, { useEffect, useState } from "react";
import api from '../api';
import '../styles/Profile.css';

function Profile(){
    const [profileData, setProfileData] = useState({
        profile_picute: null,
        bio: '',
        favorite_colors: '',
        favorite_styles: '',
        body_measurements: {}
    });

    useEffect(() => {
        api
            .get('/profile/')
            .then(response => setProfileData(response.data))
            .catch(error => console.error('Error fetching profile:', error));
    }, []);

    const handleChange = (e) =>{
        const {name, value, files } = e.target;
        setProfileData({
            ...profileData, 
            [name]: files ? files[0] : value 
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let key in profileData) {
            formData.append(key, profileData[key]);
        }
        api.put('/profile/', formData)
            .then(response => console.log('Profile updated:', response.data))
            .catch(error => console.error('Error updating profile:', error));
    };

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>Profile Picture</label>
                    <input type="file" name="profile_picture" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea name="bio" value={profileData.bio} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                    <label>Favorite Colors</label>
                    <input type="text" name="favorite_colors" value={profileData.favorite_colors} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Favorite Styles</label>
                    <input type="text" name="favorite_styles" value={profileData.favorite_styles} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Body Measurements</label>
                    <textarea name="body_measurements" value={profileData.body_measurements} onChange={handleChange}></textarea>
                </div>
                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
}

export default Profile;