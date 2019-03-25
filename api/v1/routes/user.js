import express from 'express';
import {UserController} from '../controllers';
import {AuthController} from '../controllers';
import {auth} from '../../../middlewares/auth';

const router = express.Router();

router.post('/store', UserController.store); // Route to store a new

router.post('/auth', AuthController.login); // Route to login a user

router.get('/', auth, UserController.get); // Route to get all users

export {
  router
};