import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { createContent , updateContent , getUserContent , deleteContent } from "../controllers/content.controller";

const router = Router() ;

router.use(authenticate) ;

router.post('/',createContent) ;
router.get('/',getUserContent) ;
router.patch('/:contentId',updateContent) ;
router.delete('/:contentId',deleteContent) ;

export default router ;