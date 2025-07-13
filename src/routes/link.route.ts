import { Router } from "express";
import { generateLink } from "../controllers/link.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router() ;

router.use(authenticate) ;

router.post("/",generateLink) ;

export default router ;
