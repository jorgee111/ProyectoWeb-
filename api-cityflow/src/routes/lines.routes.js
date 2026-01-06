import { Router } from "express";
import { 
    getAllLines, 
    getLineDetail 
} from "../controllers/lines.controller.js";

const router = Router();



router.get("/", getAllLines);       
router.get("/:id", getLineDetail);  

export default router;