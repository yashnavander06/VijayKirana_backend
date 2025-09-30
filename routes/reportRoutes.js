const express = require('express');
const router = express.Router();
const {getAllReports,getReportById,getReportByUserId,addReport,updateReport,deleteReport} = require('../controllers/reportController');

const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken');

// ✅ Admin-only: view all reports
router.route('/').get(verifyTokenAndAdmin, getAllReports);

// ✅ Any logged-in user can view their own reports
router.route('/:id').get( getReportById);
router.route('/user/:id').get( getReportByUserId);

// ✅ Any logged-in user can add a report
router.route('/').post(verifyToken, addReport);

// ✅ Only owner or admin can update/delete a report
router.route('/:id').put(verifyTokenAndAuthorization, updateReport);
router.route('/:id').delete(verifyTokenAndAuthorization, deleteReport);

module.exports = router;
