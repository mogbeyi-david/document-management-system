import express from 'express';
import userController from '../controllers/UserController'

const router = express.Router();

router.post('/store', userController.store());

export default router;