import React from 'react';
import DealerProfile from '../../Component/dealer/DealerProfile';
import '../../styles/dealer/dealer_profile.css';

const DealerProfilePage = () => {


  return (
    <div className="profile-page-container">
      <div className="profile-page-content">
        <DealerProfile />
      </div>
    </div>
  );
};

export default DealerProfilePage;
