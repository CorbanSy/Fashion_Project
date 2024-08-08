import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

// Define averageMeasurementsInches here
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

export const ProfileProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
        profile_picture: null,
        bio: '',
        favorite_colors: [],
        favorite_styles: [],
        body_measurements: { ...averageMeasurementsInches }
    });

    
    const [isInches, setIsInches] = useState(true);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [showColorsDropdown, setShowColorsDropdown] = useState(false);
    const [showStylesDropdown, setShowStylesDropdown] = useState(false);
    const [error, setError] = useState(null);

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

    const resetMeasurements = () => {
        setProfileData(prevState => ({
            ...prevState,
            body_measurements: { ...averageMeasurementsInches }
        }));
    };

    const formatBodyMeasurements = () => {
        return Object.keys(profileData.body_measurements).map((measurement, index) => (
            <div key={index} className="measurement-input-group">
                <label>{measurement}</label>
                <div className="measurement-input">
                    <button type="button" onClick={() => handleMeasurementChange(measurement, -1)}>-</button>
                    <input
                        type="number"
                        name={`measurement_${measurement}`}
                        value={profileData.body_measurements[measurement] || ''}
                        onChange={handleChange}
                    />
                    <button type="button" onClick={() => handleMeasurementChange(measurement, 1)}>+</button>
                </div>
            </div>
        ));
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevState => ({
            ...prevState,
            body_measurements: {
                ...prevState.body_measurements,
                [name]: value
            }
        }));
    };

    const value = {
        profileData,
        setProfileData,
        isInches,
        toggleUnit,
        resetMeasurements,
        profilePicturePreview,
        setProfilePicturePreview,
        showColorsDropdown,
        setShowColorsDropdown,
        showStylesDropdown,
        setShowStylesDropdown,
        error,
        setError,
        formatBodyMeasurements, // Added this function
        handleMeasurementChange, // Passed handleMeasurementChange as well
        handleChange // Passed handleChange as well
    };

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
