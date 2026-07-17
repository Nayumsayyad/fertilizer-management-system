const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();
//new--------------------------------
const session = require('express-session');
const MongoStore = require('connect-mongo');
const crypto = require('crypto');
const cron = require('node-cron');
const moment = require('moment');
const Lab = require('./models/lab/lab_account/labAccount.js');
const LabSlot = require('./models/lab/lab_account/labSlot');
// Use a fixed secret key so sessions persist across server restarts
const secretKey = process.env.SESSION_SECRET || 'agronest-session-secret-key-2024';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nayum:Nayum12@cluster0.vhbehcx.mongodb.net/AgroNest';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
// Set up session middleware
app.use(session({
  secret: secretKey, 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }), 
}));
//end---------------------------------
const fs = require('fs');
const articleRoutes = require('./routes/articles/articleRoutes.js');

const PORT = process.env.PORT || 8070;
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(bodyParser.json());
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connection success!");
}).catch((error) => {
    console.log("MongoDB connection error:", error);
});

const fertilizerRouter = require('./routes/dealer/inventory_mgmt/fertilizers.js');
app.use('/fertilizer', fertilizerRouter);
const dealerRouter = require('./routes/dealer/dealer_acc_mgmt/dealers.js');
app.use('/dealer', dealerRouter);
const farmerFeedbackRoutes = require("./routes/inquiries/farmerfeedbacks.js");
app.use("/api/feedbacks", farmerFeedbackRoutes);
const farmerReportRoutes = require("./routes/inquiries/farmerReports.js");
app.use("/api/reports/", farmerReportRoutes);
const farmerRouter = require("./routes/farmer/farmers.js");
app.use("/Farmer", farmerRouter);
const soilTestRouter = require("./routes/farmer/soilTests.js");
app.use("/SoilTest", soilTestRouter);
const PdfRouter = require("./routes/farmer/PDFRoutes.js");
app.use('/pdfRouter', PdfRouter);
//const FAnalysis = require("./routes/systemManager/FAnalysis.js");
//app.use("/FAnalysis",FAnalysis);
const TopFertilizer = require("./routes/systemManager/TopFertilizerRoutes.js");
app.use("/topfertilizercategory",TopFertilizer);
const topsellingSchema = require("./routes/systemManager/TopSellingRoutes.js");
app.use("/topdealer",topsellingSchema);
const topareasSchema = require("./routes/systemManager/TopAreasRoutes.js");
app.use("/toparea",topareasSchema);
const userSchema = require("./routes/systemManager/managerloginRoutes.js");
app.use(userSchema);
const adminadd = require('./routes/systemManager/admin.js');
app.use('/api/admin', adminadd);
const labRouter = require("./routes/lab/lab_account/labAccounts.js");
app.use("/labAccount", labRouter);
const ItemRouter = require('./routes/orders/ItemR');
app.use('/item', ItemRouter);
const OrderRouter = require('./routes/orders/OrderR');
app.use('/order', OrderRouter);
const labSlotRouter = require("./routes/lab/lab_account/labSlots.js");
app.use("/labSlot", labSlotRouter);
const testRequestRouter = require("./routes/lab/test_request/testRequests.js");
app.use("/testRequest", testRequestRouter);
const dealerRoutes = require('./routes/admin/dealer.routes');
app.use(dealerRoutes);
const farmerRoutes =require('./routes/admin/farmer.routes');
app.use(farmerRoutes);
const labsRouter = require('./routes/admin/labs.js');
app.use('/labs', labsRouter);
const dealerReportRouter = require('./routes/admin/dealersReport.js');
app.use("/farmerReport", dealerReportRouter);
const replyRoutess = require('./routes/admin/reply.js');
app.use('/replies', replyRoutess);
const farmerReport = require('./routes/admin/farmerReport.js')
app.use("/farmerReport",farmerReport)
const adminRoutes = require('./routes/admin/adminRoutes.js');
app.use('/admin', adminRoutes);
const countDealer = require('./routes/admin/countCealer.js')
app.use(countDealer);
const inquiryCount = require('./routes/admin/inquiryCount.js');
app.use(inquiryCount);
const profileRoutes = require('./routes/admin/Profile.js');
app.use('/api/profile', profileRoutes);
app.use('/api/auth', adminRoutes);
const labReportRouter = require("./routes/lab/test_request/labReports.js");
app.use("/labReport", labReportRouter);
//------------------------------------------------------------------------------------------------------------------
cron.schedule('0 0 * * *', async () => {
    try {
      const currentDate = moment().startOf('day');
 
      const targetDate = currentDate.clone().add(3, 'days').toDate();

      const labs = await Lab.find({}, '_id'); 
      const addTimeSlots = require('./routes/lab/lab_account/labSlotsUtility.js');

      for (const lab of labs) {
        await addTimeSlots(targetDate, lab._id);
      }
  
      console.log('Time slots added for all existing labs for the target date');
    } catch (error) {
      console.error('Error adding time slots:', error);
    }
  });
  //---------------------------------------------------------------------------------------------
  cron.schedule('0 * * * *', async () => {
    try {
      const currentDateTime = moment();
    
      await LabSlot.updateMany(
        { timeSlots: { $elemMatch: { endTime: { $lt: currentDateTime.toDate() } } } }, 
        { $pull: { timeSlots: { endTime: { $lt: currentDateTime.toDate() } } } } 
      );
    
      console.log('Expired time slots deleted');
    } catch (error) {
      console.error('Error deleting expired time slots:', error);
    }
  });
  //--------------------------------------------------------------------------------------------------------------------------
// const articlerouter = require("./routes/articles/articleRoutes.js")
// app.use("/articleModel.js", articlerouter);
app.use('/api/articles', articleRoutes);

app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`);
});
