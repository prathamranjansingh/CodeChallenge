import express from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import UserModel from "../models/user";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middlewares/token";
import Filter from "bad-words";
require("dotenv");
import ProblemModel from "../models/problem";
import { existsEmail, existsUsername } from "../utils/utils";

const accounts = express.Router();

const signupSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be between 3 to 15 characters.")
        .max(15, "Username must be between 3 to 15 characters.")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores."),
    email: z
        .string()
        .email("Email is not valid."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)/, "Password must contain at least one letter and one digit.")
});


//typescript ka first is param of which we will get, second reqbody third resonse
accounts.post<
  {},
  { id?: string; token?: string; success: boolean; message: string },
  User
>("signup", async (req, res) => {
    try {
        const result = signupSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.error.errors.map(err => err.message).join(", ")
            });
        }
        const { username, email, password } = result.data;
        const filter = new Filter();
        if (filter.isProfane(username)) {
            return res.status(400).json({
                success: false,
                message: "Username contains inappropriate language.",
            });
        }

        if (await existsUsername(username)) {
            return res.status(409).json({
                success: false,
                message: "Username already exists.",
            });
        } 
        if (await existsEmail(email)) {
            return res.status(409).json({
                success: false,
                message: "Email already exists.",
            });
        }
        const hashPass = await bcrypt.hash(password, 10);
        const user = {
            username: username,
            email: email,
            password: hashPass
        }

        const userModel = new UserModel(user);
        await userModel.save();

        const userFromDb = await UserModel.findOne({
            username: username,
            email: email,
            password: hashPass,
        });

        const id = userFromDb ? userFromDb.id.toString() : "none";

        const token = jwt.sign(user.username, process.env.ACCESS_TOKEN_SECRET!);
        console.log("User '", user.username, "' signed up at ", new Date());
        res.status(201).json({
            token: token,
            id: id,
            success: true,
            message: "Account created successfully",
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error creating account"
        })
    }
});

// Route Parameters Type {}, Response Body Type -  { id?: string; token?: string; success: boolean; message: string }, Request Body Type- { username_or_email: string; password: string }

accounts.post< 
    {},
    { id?: string; token?: string; success: boolean; message: string },
    { username_or_email: string; password: string }
>("/login",async (req,res)=>{
    const {username_or_email, password} = req.body;

    if(!username_or_email || !password){
        res.status(400).json({
            success: false,
            message: "Missing required fields",
        });
        return;
    }

    try {
        const user = await UserModel.findOne({
            $or: [
                { username: username_or_email},
                { email: username_or_email }
            ]
        });

        if(user == null){
            res.status(400).json({
                success: false,
                message: "Username or Email doesn't exists",
            });
            return;
        }

        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign(
                user.username,
                process.env.ACCESS_TOKEN_SECRET!
            )
            console.log("User '", user.username, "' logged in at ", new Date());
            res.json({
                token: token,
                id: user.id,
                success: true,
                message: "Logged in successfully",
            });
        } else{
            console.log(
                "User '",
                user.username,
                "' failed login (incorrect password) at ",
                new Date()
            );
            res.json({ success: false, message: "Password incorrect" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }

})

accounts.post('delete/:id', authenticateToken, async(req,res)=>{
    try {
        const { id } = req.params;
        await UserModel.findByIdAndDelete(id);
        res.json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (e) {
        res.json({ success: false, message: e });
    }
})

accounts.get("/id/:id", authenticateToken, async (req, res) => {
    const id = req.params.id;

    const user = await UserModel.findById(id);

    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }

    res.json(user);
});


accounts.get("/:name", async (req, res) => {
    const name = req.params.name;

    const user = await UserModel.findOne({
        username: name,
    });

    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }

    let allProblems = await ProblemModel.find();

    let easyProblems = 0;
    let mediumProblems = 0;
    let hardProblems = 0;

    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    for (let i = 0; i < allProblems.length; i++) {
        if (allProblems[i].main.difficulty === "easy") {
            easyProblems++;
            if (user.problems_solved.includes(allProblems[i].main.name)) {
                easySolved++;
            }
        } else if (allProblems[i].main.difficulty === "medium") {
            mediumProblems++;
            if (user.problems_solved.includes(allProblems[i].main.name)) {
                mediumSolved++;
            }
        } else {
            hardProblems++;
            if (user.problems_solved.includes(allProblems[i].main.name)) {
                hardSolved++;
            }
        }
    }

    const publicUser = {
        username: user.username,
        email: user.email,
        submissions: user.submissions,
        problems_starred: user.problems_starred,
        problems_solved: user.problems_solved,
        easy_problems_count: easyProblems,
        medium_problems_count: mediumProblems,
        hard_problems_count: hardProblems,
        problems_solved_easy: easySolved,
        problems_solved_medium: mediumSolved,
        problems_solved_hard: hardSolved,
        problems_attempted: user.problems_attempted,
        problems_solved_count: user.problems_solved_count,
        rank: user.rank,
        views: user.views,
        solution_count: user.solution_count,
        reputation_count: user.reputation_count,
    };

    res.json(publicUser);
});



export default accounts;

