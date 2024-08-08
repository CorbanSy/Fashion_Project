import React from 'react';
import { useProfile } from './ProfileContent';
import BodyModel from './BodyModel';

const BodyMeasurements = () => {
    const {
        isInches,
        toggleUnit,
        resetMeasurements,
        formatBodyMeasurements,
        profileData
    } = useProfile();

    return (
        <div className="body-measurements-container">
            <div className="measurements-box">
                <div className="form-group">
                    <label>
                        Body Measurements 
                        <button type="button" onClick={toggleUnit}>Convert to {isInches ? 'cm' : 'inches'}</button>
                        <button type="button" onClick={resetMeasurements}>Reset</button>
                    </label>
                    <div className="measurements-input-container">
                        {formatBodyMeasurements()} {/* Calls the function */}
                    </div>
                </div>
            </div>
            <div className="body-images">
                <BodyModel measurements={profileData.body_measurements} />
            </div>
        </div>
    );
};

export default BodyMeasurements;
