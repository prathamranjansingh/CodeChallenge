import { Types } from "mongoose";
import UserModel from "../models/user";
import { Document } from "mongoose";
import { DProblem } from "../models/problem";

export async function existsUsername(username:string){
    const user = await UserModel.findOne({username:username});
    return !(user == null);
}

export async function existsEmail(email:string){
    const user = await UserModel.findOne({email:email})
    return !(user == null);
}

