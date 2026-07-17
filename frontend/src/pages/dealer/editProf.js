import React from 'react';
import EditProfile from '../../Component/dealer/editProfile';
import '../../styles/dealer/dealer_profile.css';

const DealerProfilePage = () => {

  return (
    <div className="profile-page-container">
      <div className="profile-page-content">
        <EditProfile />
      </div>
    </div>
  );
};

export default DealerProfilePage;
