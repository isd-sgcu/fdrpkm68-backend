import { Request, Response, NextFunction } from "express";
import * as groupService from "../services/groupService";

export const getGroupData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupID = req.params.id;
        const houses = await groupService.getGroupDataFromDB(groupID)
        res.status(200).json({
            status: 'success',
            houses: houses
        })
    }
    catch (error){
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while fetching group data.'
        })
    }}