import { RPKMworkshop } from "@prisma/client";

import { RpkmRepository } from "@/repository/rpkm/rpkmRepository";
import { WorkshopType } from "@/types/enum";
import { AppError } from "@/types/error/AppError";
import { workshopParticipantCountType } from "@/types/rpkm/GET";
import { WorkshopRegisterRequest } from "@/types/rpkm/POST";

export class RpkmUsecase {
    private rpkmRepository: RpkmRepository;

    constructor() {
        this.rpkmRepository = new RpkmRepository();
    }

    async register(body: WorkshopRegisterRequest, userId: string): Promise<RPKMworkshop> {
        try{
            if(body.workshopTime > 6 || body.workshopTime < 1){
                // 6 time slots for workshops
                // slot 1: 13.00-13.30
                // slot 2: 13.40-14.10
                // slot 3: 14.20-14.50
                // slot 4: 15.10-15.40
                // slot 5: 15.50-16.20
                // slot 6: 16.30-17.00
                // For example, workshopTime: 5 -> register for slot 5
                throw new AppError("workshopTime must be integer from 1 to 6.", 400);
            }
            if(!Object.values<string>(WorkshopType).includes(body.workshopType)){
                throw new AppError("workshopType must be either 'DIFFUSER' or 'KEYCHAIN'.", 400);
            }

            const [workshopDuplicate, timeSlotDuplicate] = await this.rpkmRepository.getUserWorkshopConflicts(body, userId);
            if(workshopDuplicate.length >= 1){
                throw new AppError(`User id ${userId} already registered for workshop ${body.workshopType}.`, 400);
            }
            if(timeSlotDuplicate.length >= 1){
                throw new AppError(`User id ${userId} already registered for time slot ${body.workshopTime}.`, 400);
            }

            const registrationResult = await this.rpkmRepository.userRegisterNewWorkshop(body, userId);
            return registrationResult;
        }
        catch(error) {
            console.log("Error in RpkmUsecase.register: ", error);
            throw new AppError(
                `Failed to register RPKM workshop for user: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`, 
                500
            );
        }
    }

    async getWorkshopsByUserId(userId: string): Promise<RPKMworkshop[]> {
        try{
            const results = await this.rpkmRepository.getWorkshopsRegisteredByUserID(userId);
            return results;
        }
        catch(error) {
            console.log("Error in RpkmUsecase.getWorkshopsByUserId: ", error);
            throw new AppError(
                `Failed to get RPKM workshops registered by user id ${userId}: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`, 
                500
            );            
        }
    }

    async getWorkshopParticipantCounts(): Promise<workshopParticipantCountType[]> {
        try{
            const result = await this.rpkmRepository.getWorkshopsParticipantCounts();
            return result
        }
        catch(error) {
            console.log("Error in RpkmUsecase.getWorkshopParticipantCounts: ", error);
            throw new AppError(
                `Failed to get participant counts of RPKM workshops: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`, 
                500
            );
        }
    }
}