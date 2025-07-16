import { Router } from "express";
import { generateLink } from "../controllers/link.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router() ;

router.use(authenticate) ;

router.post("/",generateLink) ;

export default router ;
