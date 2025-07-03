import { Request, Response, NextFunction } from 'express';
import * as houseService from '../services/houseService'
import { House } from '../types/house';
import { CustomError } from '../types/error';
import { group } from 'console';

export const createAHouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name_thai = req.body.name_thai
        const name_english = req.body.name_english
        const logo = req.body.logo
        const description_thai = req.body.description_thai
    }
    catch (error){

    }
}

// send all houses info (full House objects, not just house names) to frontend
export const getAllHouses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const houses = await houseService.getAllHousesFromDB() // House[]
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

// retrieve user's selected house(s)
export const getSelectedHousesIds = async (req: Request, res: Response, next: NextFunction) => {
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
            message: `Fetching names of houses selected by group with id ${group_id} failed.`
        })
    }
}

export const upDateHousesDraft = async (req: Request, res: Response, next: NextFunction) => {
    const group_id = req.params.groupId
    try {
        const new_house_name = req.body.new_house_name
        const rank = req.body.rank
        if(!new_house_name){
            res.status(400).json({
                status: 'error',
                message: "Cannot set a house to null. Use /deleteOneHouseFromDraft/:groupId to delete a house off the group's list of selected houses."
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
        const result = await houseService.updateGroupHouseOnDB(group_id, new_house_name, rank)
        if(!result){
            res.status(400).json({
                status: 'error',
                message: `Either ${new_house_name} already exists in group's list of selected houses, or something else went wrong.`
            })
            return
        }
        res.status(200).json({
            status: 'success',
            message: `Successfully updated house rank ${rank+1} of group with id ${group_id} to ${new_house_name}.`
        })
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: `Could not update a house on group with id ${group_id}.`
        })
    }
}

export const deleteOneHouseFromDraft = async (req: Request, res: Response, next: NextFunction) => {
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

export const deleteAllHousesFromDraft = async (req: Request, res: Response, next: NextFunction) => {
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

export const submitHousesDraft = async (req: Request, res: Response, next: NextFunction) => {
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