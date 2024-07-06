import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/Profile.css';

const stylesOptions = [
    '00s', '20s', '30s', '40s', '50s', '60s', '70s', '80s', '90s',
    'Androgynous', 'Artsy', 'Ballerina', 'Basic', 'Beach', 'Biker', 'Boho', 'Business casual',
    'Casual', 'Comfy', 'Country', 'Dark Academia', 'Eclectic', 'Edgy', 'Elegant', 'Ethereal',
    'Feminine', 'Folk', 'Formal', 'French', 'Fun', 'Funky', 'Garconne', 'Geek chic', 'Girl next door',
    'Glamorous', 'Goth', 'Granola', 'Grunge', 'Hipster', 'Kooky', 'Lagenlook', 'Masculine', 'Military',
    'Minimalist', 'Modest', 'Prairie', 'Preppy', 'Punk', 'Racy', 'Rocker', 'Romantic', 'Skateboard',
    'Sporty', 'Street', 'Toddler', 'Traditional', 'Vintage'
];

const bodyMeasurementsOptions = [
    'Full hip', 'Waist', 'Inseam', 'Outseam', 'Rise',
    'Shoulder', 'Front Bodice', 'Back Bodice', 'Arm Length',
    'Bust', 'Upper Bust', 'Neck', 'Hip', 'Length of Skirt'
];

function Profile() {
    const [profileData, setProfileData] = useState({
        profile_picture: null,
        bio: '',
        favorite_colors: '',
        favorite_styles: [],
        body_measurements: {}
    });

    const [profilePicturePreview, setProfilePicturePreview] = useState(null);

    useEffect(() => {
        api.get('/profile/')
            .then(response => setProfileData(response.data))
            .catch(error => console.error('Error fetching profile:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value, files, selectedOptions } = e.target;
        if (files) {
            setProfileData({
                ...profileData,
                [name]: files[0]
            });
            setProfilePicturePreview(URL.createObjectURL(files[0]));
        } else if (name === "favorite_styles") {
            const values = Array.from(selectedOptions, option => option.value);
            setProfileData({
                ...profileData,
                [name]: values
            });
        } else if (bodyMeasurementsOptions.includes(name)) {
            const measurements = value.split(',').reduce((acc, curr) => {
                const [key, val] = curr.split(':');
                acc[key.trim()] = val.trim();
                return acc;
            }, {});
            setProfileData({
                ...profileData,
                [name]: value
            });
        }
        else {
            setProfileData({
                ...profileData,
                [name]: value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let key in profileData) {
            if (key === "favorite_styles" || key === "body_measurements") {
                formData.append(key, JSON.stringify(profileData[key]));
            } else {
                formData.append(key, profileData[key]);
            }
        }
        api.put('/profile/', formData)
            .then(response => console.log('Profile updated:', response.data))
            .catch(error => console.error('Error updating profile:', error));
    };

    const formatBodyMeasurements = (measurements) => {
        return bodyMeasurementsOptions.map(option => `${option}: ${measurements[option] || ''}`).join(', ');
    }

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>Profile Picture</label>
                    <input type="file" name="profile_picture" onChange={handleChange} />
                    {profilePicturePreview && <img src={profilePicturePreview} alt="Profile Preview" className="profile-picture-preview" />}
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
                    <select name="favorite_styles" value={profileData.favorite_styles} onChange={handleChange} multiple>
                        {stylesOptions.map((style, index) => (
                            <option key={index} value={style}>{style}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Body Measurements</label>
                    <textarea
                        name="body_measurements"
                        value={formatBodyMeasurements(profileData.body_measurements)}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button type="submit">Save Profile</button>
            </form>
        </div>
    );
}

export default Profile;
