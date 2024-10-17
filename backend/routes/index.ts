import express from 'express'

const router = express.Router();
router.use("/problem", problem)
router.use('/accounts', accounts)