import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/Profile.css';
import measurementImage from '../assets/measurement_image.webp'; // Adjust the path to where your image is stored

const stylesOptions = [
    '00s', '20s', '30s', '40s', '50s', '60s', '70s', '80s', '90s',
    'Androgynous', 'Artsy', 'Ballerina', 'Basic', 'Beach', 'Biker', 'Boho', 'Business casual',
    'Casual', 'Comfy', 'Country', 'Dark Academia', 'Eclectic', 'Edgy', 'Elegant', 'Ethereal',
    'Feminine', 'Folk', 'Formal', 'French', 'Fun', 'Funky', 'Garconne', 'Geek chic', 'Girl next door',
    'Glamorous', 'Goth', 'Granola', 'Grunge', 'Hipster', 'Kooky', 'Lagenlook', 'Masculine', 'Military',
    'Minimalist', 'Modest', 'Prairie', 'Preppy', 'Punk', 'Racy', 'Rocker', 'Romantic', 'Skateboard',
    'Sporty', 'Street', 'Toddler', 'Traditional', 'Vintage'
];

const colorsOptions = [
    { name: 'Red', color: '#FF0000' },
    { name: 'Crimson', color: '#DC143C' },
    { name: 'Maroon', color: '#800000' },
    { name: 'Orange', color: '#FFA500' },
    { name: 'Coral', color: '#FF7F50' },
    { name: 'Salmon', color: '#FA8072' },
    { name: 'Yellow', color: '#FFFF00' },
    { name: 'Gold', color: '#FFD700' },
    { name: 'Green', color: '#008000' },
    { name: 'Lime', color: '#00FF00' },
    { name: 'Olive', color: '#808000' },
    { name: 'Blue', color: '#0000FF' },
    { name: 'Navy', color: '#000080' },
    { name: 'Sky Blue', color: '#87CEEB' },
    { name: 'Purple', color: '#800080' },
    { name: 'Lavender', color: '#E6E6FA' },
    { name: 'Magenta', color: '#FF00FF' },
    { name: 'Pink', color: '#FFC0CB' },
    { name: 'Hot Pink', color: '#FF69B4' },
    { name: 'Brown', color: '#A52A2A' },
    { name: 'Chocolate', color: '#D2691E' },
    { name: 'Tan', color: '#D2B48C' },
    { name: 'Gray', color: '#808080' },
    { name: 'Silver', color: '#C0C0C0' },
    { name: 'Black', color: '#000000' },
    { name: 'White', color: '#FFFFFF' }
];

const bodyMeasurementsOptions = [
    'Full hip', 'Waist', 'Inseam', 'Outseam', 'Rise',
    'Shoulder', 'Front Bodice', 'Back Bodice', 'Arm Length',
    'Bust', 'Upper Bust', 'Neck', 'Hip', 'Length of Skirt'
];

const averageMeasurementsInches = {
    'Full hip': 39,
    'Waist': 34,
    'Inseam': 31,
    'Outseam': 41,
    'Rise': 10,
    'Shoulder': 18,
    'Front Bodice': 20,
    'Back Bodice': 20,
    'Arm Length': 25,
    'Bust': 40,
    'Upper Bust': 38,
    'Neck': 15,
    'Hip': 39,
    'Length of Skirt': 20
};

const convertToCm = (inches) => (inches * 2.54).toFixed(1);
const convertToInches = (cm) => (cm / 2.54).toFixed(1);

function Profile() {
    const [profileData, setProfileData] = useState({
        profile_picture: null,
        bio: '',
        favorite_colors: [],
        favorite_styles: [],
        body_measurements: { ...averageMeasurementsInches }
    });

    const [isInches, setIsInches] = useState(true);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);

    useEffect(() => {
        api.get('/profile/')
            .then(response => {
                const data = response.data;
                if (data.body_measurements) {
                    data.body_measurements = JSON.parse(data.body_measurements);
                }
                setProfileData(data);
            })
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
        } else if (name === "favorite_styles" || name === "favorite_colors") {
            const values = Array.from(selectedOptions, option => option.value);
            setProfileData({
                ...profileData,
                [name]: values
            });
        } else if (name.startsWith("measurement_")) {
            const measurementName = name.replace("measurement_", "");
            setProfileData(prevState => ({
                ...profileData,
                body_measurements: {
                    ...prevState.body_measurements,
                    [measurementName]: value
                }
            }));
        } else {
            setProfileData({
                ...profileData,
                [name]: value
            });
        }
    };

    const handleMeasurementChange = (measurement, change) => {
        setProfileData(prevState => ({
            ...prevState,
            body_measurements: {
                ...prevState.body_measurements,
                [measurement]: (parseInt(prevState.body_measurements[measurement] || 0) + change).toString()
            }
        }));
    };

    const toggleUnit = () => {
        setProfileData(prevState => ({
            ...prevState,
            body_measurements: Object.keys(prevState.body_measurements).reduce((acc, key) => {
                acc[key] = isInches ? convertToCm(prevState.body_measurements[key]) : convertToInches(prevState.body_measurements[key]);
                return acc;
            }, {})
        }));
        setIsInches(!isInches);
    };

    const formatBodyMeasurements = () => {
        return bodyMeasurementsOptions.map((measurement, index) => (
            <div key={index} className='measurement-input-group'>
                <label>{measurement}</label>
                <div className='measurement-input'>
                    <button type='button' onClick={() => handleMeasurementChange(measurement, -1)}>-</button>
                    <input
                        type='number'
                        name={`measurement_${measurement}`}
                        value={profileData.body_measurements[measurement] || ''}
                        onChange={handleChange}
                    />
                    <button type='button' onClick={() => handleMeasurementChange(measurement, 1)}>+</button>
                </div>
            </div>
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let key in profileData) {
            if (key === "favorite_styles" || key === "favorite_colors" || key === "body_measurements") {
                formData.append(key, JSON.stringify(profileData[key]));
            } else {
                formData.append(key, profileData[key]);
            }
        }
        api.put('/profile/', formData)
            .then(response => console.log('Profile updated:', response.data))
            .catch(error => console.error('Error updating profile:', error));
    };

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <form onSubmit={handleSubmit} className="profile-form-container">
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
                    <select name="favorite_colors" value={profileData.favorite_colors} onChange={handleChange} multiple>
                        {colorsOptions.map((color, index) => (
                            <option key={index} value={color.name}>
                                {color.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Favorite Styles</label>
                    <select name="favorite_styles" value={profileData.favorite_styles} onChange={handleChange} multiple>
                        {stylesOptions.map((style, index) => (
                            <option key={index} value={style}>{style}</option>
                        ))}
                    </select>
                </div>
                <div className="body-measurements-container">
                    <div className="measurements-box">
                        <div className="form-group">
                            <label>Body Measurements <button type="button" onClick={toggleUnit}>Convert to {isInches ? 'cm' : 'inches'}</button></label>
                            <div className="measurements-input-container">
                                {formatBodyMeasurements()}
                            </div>
                        </div>
                    </div>
                </div>
                <img src={measurementImage} alt="Body Measurements Guide" className="measurement-image" />
                <div className="button-container">
                    <button type="submit">Save Profile</button>
                </div>
            </form>
        </div>
    );
}

export default Profile;
