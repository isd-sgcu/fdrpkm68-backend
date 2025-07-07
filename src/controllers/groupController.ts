import { Request, Response, NextFunction } from "express";
import * as groupService from "../services/groupService";
import * as userService from "../services/userService";
import { clearCache } from "../utils/CacheUtils";
import { GroupRoleType } from "../types/enum";


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

    // clear cache key first because cache lasts for 1 hour and when
    // cache is set it may let an user create >1 group because the cached version
    // states that user isn't tied to a group.
    const cacheKey = `user:${req?.user?.student_id}:${req?.user?.citizen_id}`;
    clearCache([cacheKey]);

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
      message: 'Successfully created new group.',
      newGroup: groupID
    })
  }catch (error){
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while creating group.'
        })
    }
}

export const joinGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groupID = req.params.id;
      if (!req?.user?.student_id || !req?.user?.citizen_id){
        res.status(401).json({
          status: 'error',
          message: 'Unauthorized.'
        })
        return;
      }


      // check if group exists
      if ((await groupService.getGroupDataFromDB(groupID)).length === 0){
        res.status(404).json({
          status: 'error',
          message: 'Group to join not found.'
        })
        return;
      }


      const cacheKey = `user:${req?.user?.student_id}:${req?.user?.citizen_id}`;
    await clearCache([cacheKey]);

    const user = await userService.findUserByStudentIdAndCitizenId(req.user.student_id,req.user.citizen_id);

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found.'
      })
      return;
    }

    // it would not make sense for a user who is already in the group
    // that the user wants to join to join the same group again.
    if (user.group_id === groupID){
      res.status(400).json({
        status: 'error',
        message: 'User is already in the group that the user wants to join.'
      })
      return;
    }

    // to join a new group as a group non-owner, user must leave the group user is
    // already in first.
    if (user.group_role === GroupRoleType.member){
      res.status(400).json({
        status: 'error',
        message: 'User is already a non-owner in a different group.'
      })
      return;
    }

    // to join a new group as a group owner, the original group (group to leave)
    // must only consist of one member (a.k.a. the owner)

    // if user's current is group is null (i.e., not in a group), this check can be skipped.
    if (user.group_id){
      const originalGroup = (await groupService.getGroupDataFromDB(user.group_id))[0];
      if (user.group_role === GroupRoleType.owner && (originalGroup as any).group_member_count > 1){
        res.status(400).json({
        status: 'error',
        message: 'User is an owner of a group with other members.'
      });
      return;
      }    
    }


    await groupService.joinGroup(groupID, user);

    res.status(201).json({
      status: 'success',
      message: 'Successfully joined new group.',
      newGroup: groupID
    })




      }
    catch (error){
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while joining group.'
        })
    }}