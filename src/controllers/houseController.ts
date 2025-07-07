import { Request, Response, NextFunction } from 'express';
import * as houseService from '../services/houseService'


export const getAllHouses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const houses = await houseService.getAllHousesFromDB()
        res.status(200).json({
            status: 'success',
            houses: houses
        })
    }
    catch (error){
        res.status(500).json({
            status: 'error',
            message: `Error occured while fetching houses data: ${error}`
        })
    }
}

export const getCurrentMemberCounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const member_counts = await houseService.getCurrentMemberCountsFromDB()
        res.status(200).json({
            status: 'success',
            member_counts: member_counts
        })
    }
    catch (error){
        res.status(500).json({
            status: 'error',
            message: `Error occured while fetching houses' current member counts: ${error}`
        })
    }
}

export const getGroupSelectedHousesIds = async (req: Request, res: Response, next: NextFunction) => {
    const group_id = req.params.groupId
    try {
        const selected_houses = await houseService.getSelectedHousesIDsFromDB(group_id)
        res.status(200).json({
            status: 'success',
            selected_houses: selected_houses
        })
    }
    catch (error) {
        res.status(500).json({
            status: 'error', 
            message: `Error occured while fetching IDs of houses selected by group with id ${group_id}: ${error}`
        })
    }
}

export const upDateGroupHouses = async (req: Request, res: Response, next: NextFunction) => {
    const group_id = req.params.groupId
    try {
        const new_house_id = req.body.new_house_id
        const rank = req.body.rank
        if(!new_house_id){
            res.status(400).json({
                status: 'error',
                message: "Cannot set a house to null or non-integer types. Use deleteOne/:groupId to delete a house off the group's selected houses."
            })
            return
        }
        if(rank < 0 || rank > 5){
            res.status(400).json({
                status: 'error',
                message: 'Incoming rank must be between 0 to 5.'
            })
            return
        }
        const errorMsg = await houseService.addOneGroupHouseOnDB(group_id, new_house_id, rank)
        if(errorMsg.trim().length !== 0){
            res.status(400).json({
                status: 'error',
                message: errorMsg
            })
            return
        }
        res.status(200).json({
            status: 'success',
            message: `Successfully updated house rank ${rank+1} of group with id ${group_id} to house id ${new_house_id}.`
        })
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: `Could not update a house on group with id ${group_id}.`
        })
    }
}

export const deleteOneHouseFromGroup = async (req: Request, res: Response, next: NextFunction) => {
    const group_id = req.params.groupId
    try {
        const rank_to_delete = req.body.rank_to_delete
        if(rank_to_delete < 0 || rank_to_delete > 5){
            res.status(400).json({
                status: 'error',
                message: "Incoming rank must be between 0 to 5."
            })
            return
        }
        const result = await houseService.deleteOneGroupHouseOnDB(group_id, rank_to_delete)
        if(!result){
            res.status(400).json({
                status: 'error',
                message: `Deletion failed.`
            })
            return
        }
        res.status(200).json({
            status: 'success',
            message: `Successfully deleted house rank ${rank_to_delete+1} of group with id ${group_id}.`
        })
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: `Could not delete a house off the group with id ${group_id}.`
        })
    }
}

export const deleteAllHousesFromGroup = async (req: Request, res: Response, next: NextFunction) => {
    const group_id = req.params.groupId
    try {
        const result = await houseService.deleteAllGroupHousesOnDB(group_id)
        if(!result){
            res.status(400).json({
                status: 'error',
                message: `Deletion failed.`
            })
            return
        }
        res.status(200).json({
            status: 'success',
            message: `Successfully deleted all houses off the group with id ${group_id}.`
        })
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: `Could not delete all houses off the group with id ${group_id}.`
        })
    }
}

export const submitGroupHouses = async (req: Request, res: Response, next: NextFunction) => {
    const group_id = req.params.groupId
    try {
        const result = await houseService.submitGroupHousesToDB(group_id)
        if(!result){
            res.status(400).json({
                status: 'error',
                message: `Submission failed.`
            })
            return
        }
        res.status(201).json({
            status: 'success',
            message: `Successfully submit selected houses of group with id ${group_id}.`
        })
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: `Could not submitted selected houses of group with id ${group_id}.`
        })
    }
}