import express from 'express';
import {UserController} from '../controllers';
import {AuthController} from '../controllers';

const router = express.Router();

router.post('/store', UserController.store);
router.post('/auth', AuthController.login);

export {
  router
};