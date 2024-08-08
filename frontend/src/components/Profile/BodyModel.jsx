import React from 'react';
import '../../styles/BodyModel.css';
import bodyFront from '../../assets/male-mann-body.jpg'; // Update this path
import bodySide from '../../assets/sidemale.png'; // Update this path
import bodyBack from '../../assets/backmale.png'; // Update this path

const BodyModel = ({ measurements }) => {
  return (
    <div className="body-model-container">
      <div className="body-images">
        <img src={bodyFront} alt="Body Front" className="body-image" />
        <img src={bodySide} alt="Body Side" className="body-image" />
        <img src={bodyBack} alt="Body Back" className="body-image" />
      </div>
    </div>
  );
};

export default BodyModel;
