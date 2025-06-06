import express from 'express';

import {
    signUp,
    logIn,
    authen,
    getUser
} from '../controllers/userControllers/loginCotroller.js';

import {
    requestAdmin,
    checkRequestStatus,
    cancelAdminRequest,
} from '../controllers/userControllers/userAdminCotroller.js';

import {
    adminRequestsAll,
    approveAdmin,
    refuseAdmin,
    deleteAdminRequest,
} from '../controllers/userControllers/adminRequestController.js';

import {
    getDataUser,
    updateUser,
} from '../controllers/userControllers/profileController.js';

import {
    getUserAll,
    updateUserByRoot,
    deleteUser,
    signUpByRoot,
} from '../controllers/userControllers/manageAdminController.js'

const router = express.Router();

//login
router.post('/api/SignUp',signUp);
router.post('/api/logIn',logIn);
router.post('/api/authen',authen);
router.get('/api/getUser/:uid',getUser);

//userAdmin
router.post('/api/reqAdmin',requestAdmin);
router.get('/api/checkReqStatus/:uid',checkRequestStatus);
router.delete('/api/cancelReq/:uid',cancelAdminRequest);

//adminRequest
router.get('/api/getRequestAll',adminRequestsAll);
router.post('/api/approve/:uid',approveAdmin);
router.post('/api/refuse/:uid',refuseAdmin);
router.delete('/api/delete/:uid',deleteAdminRequest);

//profile
router.get('/api/getUserData/:uid',getDataUser);
router.put('/api/updateUser/:uid',updateUser);

//manageAdmin
router.get('/api/getUserAll',getUserAll);
router.put('/api/upDateUserByRoot/:uid',updateUserByRoot);
router.delete('/api/deleteUser/:uid',deleteUser);
router.post('/api/signUpByRoot',signUpByRoot);

export default router;