import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createContent , updateContent , getUserContent , deleteContent } from "../controllers/content.controller.js";

const router = Router() ;

router.use(authenticate) ;

router.post('/',createContent) ;
router.get('/',getUserContent) ;
router.patch('/:contentId',updateContent) ;
router.delete('/:contentId',deleteContent) ;

export default router ;