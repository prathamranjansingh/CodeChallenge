import express, {json} from "express"
import ProblemModel from "../models/problem"
import UserModel from "../models/user"
import { DProblem } from "../models/problem"
import { sortByAcceptance, sortByDifficulty, sortByTitle } from "../utils/utils"
const problem = express.Router();

problem.post("/all", async(req, res)=>{
    const {id} = req.body;
    const search = req.query.search || "";
    const difficulty = req.query.difficulty || "";
    const acceptance = req.query.acceptance || "";
    const title = req.query.title || "";

    try {
        const allProblems = await ProblemModel.find(
            {"main.name":{ $regex: search, $options: "i"}},
            "main.id main.name main.acceptance_rate_count main.difficulty main.like_count main.dislike_count"
        )   
            .sort({"main.id":1})
            .exec();

        const allProblemsSorted = sortByAcceptance(
            acceptance.toString() as Sort,
            sortByDifficulty(
                difficulty.toString() as Sort,
                sortByTitle(title.toString() as Sort, allProblems)
            )
        );
        const user = await UserModel.findById(id);
        const sOrA = {
            solved: user?.problems_solved,
            attempted: user?.problems_attempted,
        };

        let allProblemsArray: DProblem[] = JSON.parse(
            JSON.stringify(allProblemsSorted)
        );

        if (sOrA.attempted) {
            for (let i = 0; i < allProblemsArray.length; i++) {
                if (sOrA.attempted.includes(allProblemsArray[i].main.name)) {
                    allProblemsArray[i].main.status = "attempted";
                }
            }
        }
        if (sOrA.solved) {
            for (let i = 0; i < allProblemsArray.length; i++) {
                if (sOrA.solved.includes(allProblemsArray[i].main.name)) {
                    allProblemsArray[i].main.status = "solved";
                }
            }
        }

        res.json(allProblemsArray);

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal Server Error" });
    }
})

