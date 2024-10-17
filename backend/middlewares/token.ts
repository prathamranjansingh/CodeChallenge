import express, { NextFunction } from 'express'
import jwt from 'jsonwebtoken'

require('dotenv');

interface UserRequest extends express.Request {
    user?: string;
}

export function authenticateToken(
    req:UserRequest,
    res: express.Response,
    next: NextFunction
){
    const authHeader = req.headers['authorization'];
    const token = authHeader;
    if(!token){
        return res.status(401).json({success:false, message:"Token not given"})
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET! , (err, decoded) => {
        if(err){
            return res.status(403).json({success:false, message:"Invaild token"})
        }
        req.user = decoded?.toString();
        next(); // This calls the next middleware or route handler
    })
}