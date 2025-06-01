import express from 'express';
import {
    login,
    signUp,
    signUpByRoot,
    forgotPassword,
    getUserByUid,
    requestAdmin,
    checkAdminRequest,
    cancelAdminRequest,
    adminRequestsAll,
    approveAdmin,
    refuseAdmin,
    getUser,
    updateUser,
    deleteUser,

  } from '../controllers/userControllers.js'; 

const router = express.Router();

router.post('/login', login);
router.post('/signUp', signUp);
router.get('/getUser/:uid', getUserByUid);
router.post('/signUpByRoot', signUpByRoot);
router.post('/forgotPassword', forgotPassword);
router.get('/getUser/:uid',getUserByUid);
router.post('/requestAdmin', requestAdmin);
router.get('/checkAdminRequest/:uid',checkAdminRequest);
router.delete('/cancelAdminRequest/:uid',cancelAdminRequest);
router.get('/adminRequestsAll',adminRequestsAll);
router.post('/approveAdmin/:uid', approveAdmin);
router.post('/refuseAdmin/:uid', refuseAdmin);
router.get('/getUser',getUser);
router.put('/updateUser/:uid',updateUser);
router.delete('/deleteUser/:uid',deleteUser);

export default router;