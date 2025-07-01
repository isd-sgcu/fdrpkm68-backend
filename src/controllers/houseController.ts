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
        console.log(error)
        next(error)
    }
}

// retrieve user's selected house(s)
export const getSelectedHouses = async (req: Request, res: Response, next: NextFunction) => {
    try {

    }
    catch (error) {

    }
}

export const saveHousesDraft = async (req: Request, res: Response, next: NextFunction) => {
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

    }
}

export const deleteOneHouseDraft = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // check if the person is the group leader (non-group leader can't make changes on house)
        // get primary key (name_Thai) of the house to be deleted
        // delete the house from users' selected house in the db
    }
    catch (error) {

    }
}

export const deleteAllHousesDraft = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // check if the person is the group leader
        // and just delete all selected houses from 
    }
    catch (error) {

    }
}

export const confirmSelectedHouses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // may be redundant because already have saveHousesDraft?
        // Even when user confirm and actually submit houses, we can just call saveHousesDraft right?
    }
    catch (error) {

    }
}