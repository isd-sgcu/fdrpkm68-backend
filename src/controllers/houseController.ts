import { Request, Response, NextFunction } from 'express';
import * as houseService from '../services/houseService'
import { House } from '../types/house';
import { CustomError } from '../types/error';

// send all houses info to frontend
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
            message: 'Error occured while fetching houses data.'
        })
    }
}

// retrieve user's selected house(s)
export const getSelectedHouses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const group_id = req.group?.group_id
        // const selectedHouses = 
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Fetching '
        })
    }
}

export const createHousesDraft = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // ?
        const student_ids = req.body.student_ids
        const citizen_ids = req.body.citizen_ids
        if(student_ids.length > 3 || student_ids.length < 1 || citizen_ids.length > 3 || citizen_ids.length < 1 || citizen_ids.length !== student_ids.length){
            const error: CustomError = new Error('Invalid number of users in the group.')
            error.statusCode = 400
            throw error
        }
        // ...
    }
    catch (error){
        res.status(500).json({
            status: 'error',
            message: 'Error occured while fetching houses data.'
        })
    }
}

export const upDateHousesDraft = async (req: Request, res: Response, next: NextFunction) => {
    try {

    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Could not update a house'
        })
    }
}

export const deleteOneHouseFromDraft = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // check if the person is the group leader (non-group leader can't make changes on house)
        // get primary key (name_Thai) of the house to be deleted
        // delete the house from users' selected house in the db
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Could not delete a house off the group.'
        })
    }
}

export const deleteAllHousesFromDraft = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // check if the person is the group leader
        // and just delete all selected houses from 
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Could not delete all houses off the group.'
        })
    }
}

export const submitHousesDraft = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Could not submit selected houses.'
        })
    }
}