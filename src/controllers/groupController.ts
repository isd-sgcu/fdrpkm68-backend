import { Request, Response, NextFunction } from "express";
import * as groupService from "../services/groupService";
import * as userService from "../services/userService";


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

export const createOwnGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {

    if (!req?.user?.student_id || !req?.user?.citizen_id){
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized.'
      })
      return;
    }

    const user = await userService.findUserByStudentIdAndCitizenId(req.user.student_id,req.user.citizen_id);

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found.'
      })
      return;
    }

    if (user.group_id){
      res.status(400).json({
        status: 'error',
        message: 'User already in a group, can\'t create additional groups.'
      })
      return;
    }


    const groupID = crypto.randomUUID();
    await groupService.createOwnUserGroup(groupID, user);
    res.status(201).json({
      status: 'success',
      newGroup: groupID
    })
  }catch (error){
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while creating group.'
        })
    }
}