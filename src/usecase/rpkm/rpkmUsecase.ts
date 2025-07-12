import { RpkmRepository } from "@/repository/rpkm/rpkmRepository";
import { WorkshopRegisterRequest } from "@/types/rpkm/POST";
import { RPKMworkshop } from "@prisma/client";
import { AppError } from "@/types/error/AppError";
import { WorkshopType } from "@/types/enum";
import { workshopParticipantCountType } from "@/types/rpkm/GET";

export class RpkmUsecase {
    private rpkmRepository: RpkmRepository;

    constructor() {
        this.rpkmRepository = new RpkmRepository();
    }

    async register(body: WorkshopRegisterRequest, userId: string): Promise<RPKMworkshop> {
        try{
            if(body.workshopTime > 5 || body.workshopTime < 0){
                throw new AppError("workshopTime must be integer from 0 to 5.", 400);
            }
            if(!Object.values<string>(WorkshopType).includes(body.workshopType)){
                throw new AppError("workshopType must be either 'DIFFUSER' or 'KEYCHAIN'.", 400);
            }

            body.workshopTime += 1;
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