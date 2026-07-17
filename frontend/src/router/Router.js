import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
//common
import LandingPage from '../pages/common/LandingPage';
import Header from '../Component/common/header';
import LoginType from '../pages/common/LoginType';
import SignupType from '../pages/common/SignUpType';
import ProfType from '../pages/common/ProfileType';
//dealer
import DealerProf from '../pages/dealer/DealerProf';
import LoginPage from '../pages/dealer/DealerLogin';
import SignupPage from '../pages/dealer/DealerSignUp';
import EditProfile from '../pages/dealer/editProf';
import ManageShop from '../pages/dealer/ManageShop';
import Orders from '../pages/dealer/Orders';
import ShopAnalysis from '../pages/dealer/Analysis';
//inquiries
import InquiryCategory from '../pages/inquiries/InquiryPages/inquiryCategory';
import FormPage from '../pages/inquiries/InquiryPages/formPage';
import FarmerInquiry from '../pages/inquiries/InquiryPages/farmerInquiry';
import DealerInquiry from '../pages/inquiries/InquiryPages/dealerInquiry';
import FeedbackForm from '../pages/inquiries/FeedbackPages/FeedbackForm';
import PastFeedbackList from '../pages/inquiries/FeedbackPages/PastFeedbackList';
import FeedbackCardView from '../pages/inquiries/FeedbackPages/FeedbackCardView';
import DealerRating from '../pages/inquiries/FeedbackPages/DealerRating';
//lab
import LabSignUp from '../pages/lab/signup';
import LabLogin from '../pages/lab/labLogin'
import LabDash from '../pages/lab/labDash';
import LabProfile from '../pages/lab/labProfile';
import LabEdit from '../pages/lab/labEdit';
import TestAccept from '../pages/lab/accepted';
import TestComplete from '../pages/lab/completed';
import FileUpload from '../pages/lab/uploadFile';
//orders
import ItemView from '../Component/orders/ItemView';
import OrderHistoryPage from '../Component/orders/orderHistory';
import UpdateOrderDialog from '../Component/orders/orderUpdate';
import ItemList from '../Component/orders/Itemlist';
//farmer
import RegisterForm from '../pages/farmer/RegisterForm';
import FarmerProfile from '../Component/farmer/FarmerProfile';
import Sidebar from '../Component/farmer/Sidebar';
import SoilTestRequest from '../pages/farmer/SoilTest/SoilTestRequest';
import TestServices from '../pages/farmer/SoilTest/TestServices';
import ViewRequests from '../pages/farmer/SoilTest/ViewRequests';
import RequestDetails from '../pages/farmer/SoilTest/RequestDetails';
import UpdateRequest from '../pages/farmer/SoilTest/UpdateRequest';
import Login from '../pages/farmer/Login';
import TestType from '../pages/farmer/SoilTest/TestType';
import ViewResolvedRequests from '../pages/farmer/SoilTest/ViewResolvedRequests';
import UpdateProfile from '../pages/farmer/UpdateProfile';
//articles
import ArticleList from '../pages/articles/ArticleList';
import ArticleForm from '../pages/articles/ArticleForm';
import Form from '../pages/articles/Form';
import DataTable from '../pages/articles/DataTable';
import GmailButton from '../pages/articles/GmailButton';
//admin
import DealerList from '../Component/admin/DealerList';
import FarmerList from '../Component/admin/FarmerList';
import LabCards from '../Component/admin/LabCard';
import FullWidthTabs from '../Component/admin/FullWidthTabs';
import AdminLogin from '../Component/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
//systemManager
import TopFertilizer from  '../pages/systemManager/TopfertilizerScreen';
import AddTopAreas from '../pages/systemManager/TopAreaScreen';
import SysManagerDashboard from '../pages/systemManager/SysManagerDashboard';
import ViewTopFertilizer from '../pages/systemManager/ViewTopFertilizer';
import MLogin from '../Component/systemManager/login/MLogin';
import TopArea from '../pages/systemManager/TopAreaScreen';
import AddTopfertilizer from'../Component/systemManager/AddTopSelling'
import ViewTopSellers from '../pages/systemManager/ViewTopSelling';
import  ViewTopRegisterdArea from'../pages/systemManager/ViewTopAreas'
import AddAdminForm from '../Component/systemManager/FormCntainer/Form'
import ViewAdmin from '../Component/systemManager/ViewAdmins'

const Router = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const farmerLoggedIn = localStorage.getItem('isLoggedIn');
    if (token || farmerLoggedIn === 'true') {
      setIsLoggedIn(true);
    }else {
      setIsLoggedIn(false); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('logId');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/'); 
  };

  return (
    <>
      {isLoggedIn && <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      
      <Routes>
        <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} />} />
        <Route path="/loginDealer" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signupDealer" element={<SignupPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/profileDealer" element={<DealerProf isLoggedIn={isLoggedIn} />} />
        <Route path="/editProf" element={<EditProfile />} />
        <Route path="/manageShop" element={<ManageShop />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/logintype" element={<LoginType />} />
        <Route path="/signuptype" element={<SignupType />} />
        <Route path="/profiletype" element={<ProfType />} />
        <Route path="/analysis" element={<ShopAnalysis />} />
        <Route path="/inquiryCategory" element={<InquiryCategory />} />
        <Route path="/farmerInquiry" element={<FarmerInquiry />} />
        <Route path="/dealerInquiry" element={<DealerInquiry />} />
        <Route path="/formPage" element={<FormPage />} />
        <Route path="/FeedbackForm" element={<FeedbackForm />} />
        <Route path="/FeedbackForm/:feedbackId" element={<FeedbackForm />} />
        <Route path="/PastFeedbackList" element={<PastFeedbackList />} />
        <Route path="/FeedbackCardView" element={<FeedbackCardView />} />
        <Route path="/DealerRating" element={<DealerRating />} />
        <Route path="/RegisterForm" element={<RegisterForm />} />
        <Route path="/Profile/:farmerID" element={<FarmerProfile />} />
        <Route path="/farmer/:farmerID" element={<FarmerProfile />} />
        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/soil-test-request" element={<SoilTestRequest />} />
        <Route path="/soil-test" element={<TestServices />} />
        <Route path="/pending-requests" element={<ViewRequests />} />
        <Route path="/soil-test/:requestId" element={<RequestDetails />} />
        <Route path="/update-request/:requestId" element={<UpdateRequest />} />
        <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/test-types" element={<TestType />} />
        <Route path="/resolved-requests" element={<ViewResolvedRequests />} />
        <Route path="/edit-profile/:farmerID" element={<UpdateProfile />} />
        <Route path="/labSignup" element={<LabSignUp />} />
        <Route path="/labLogin" element={<LabLogin setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/labDash" element={<LabDash />} />
        <Route path="/labProfile" element={<LabProfile />} />
        <Route path="/labEdit" element={<LabEdit />} />
        <Route path="/accepted" element={<TestAccept />} />
        <Route path="/completed" element={<TestComplete />} />
        <Route path="/uploadFile" element={<FileUpload />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/addarticle" element={<ArticleForm />} />
        <Route path="/form" element={<Form />} />
        <Route path="/datatable" element={<DataTable />} />
        <Route path="/gmail" element={<GmailButton />} />
        <Route path="/Itemlist" element={<ItemList />} />
        <Route path="/Item/:id" element={<ItemView />} />
        <Route path="/Order-History" element={<OrderHistoryPage />} />
        <Route path="/update-order/:id" element={<UpdateOrderDialog open={true} />} />
        <Route path="/viewdealers" element={<DealerList />} />
        <Route path="/viewfarmers" element={<FarmerList />} />
        <Route path="/labrotaryview" element={<LabCards />} />
        <Route path="/userreports" element={<FullWidthTabs />} />
        <Route path="/admin/login" element={<AdminLogin setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/admin/home" element={<AdminDashboard />} />
        <Route path="/form" element={<Form />} />
        <Route path="/datatable" element={<DataTable />} />
        <Route path="/gmail" element={<GmailButton />} />
        <Route path="/addtopfertilizers" element={<TopFertilizer />} />
        <Route path="/viewtopfertilizers" element={<ViewTopFertilizer />} />
        <Route path="/addtopsellingfertilizers" element={<AddTopfertilizer />} />
        <Route path="/addtopareas" element={<AddTopAreas />} />
        <Route path="/managerdashboard" element={<SysManagerDashboard />} />
        <Route path="/MLogin" element={<MLogin />} />
        <Route path="/TopArea" element={<TopArea />} />
        <Route path="/TopSellers" element={<ViewTopSellers />} />
        <Route path="/ViewTopRegisterdArea" element={<ViewTopRegisterdArea />} />
        <Route path="/addadmin" element={<AddAdminForm />} />
        <Route path="/viewadmin" element={<ViewAdmin />} />
      </Routes>
    </>
  );
};

export default Router;
