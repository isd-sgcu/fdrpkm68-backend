import { Response } from "express";
import { WorkshopRegisterRequest } from "../../types/rpkm/POST";
import { RpkmUsecase } from "../../usecase/rpkm/rpkmUsecase";
import { AuthenticatedRequest } from "../../types/auth/authenticatedRequest";
import { UUIDValidator } from "../../utils/uuidValidator";

export class RpkmController {
    private rpkmUsecase: RpkmUsecase;

    constructor() {
        this.rpkmUsecase = new RpkmUsecase();
    }

    async registerWorkshop(req: AuthenticatedRequest, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;
            if(!userId){
                res.status(401).json({
                    success: false,
                    error: "User not authenticated.",
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            
            const body: WorkshopRegisterRequest = req.body;
            if(!body.userId || !body.workshopTime || !body.workshopType){
                res.status(400).json({
                    success: false,
                    error: "Requires non-null userId, workshopType, and workshopTime.",
                    timestamp: new Date().toISOString(),
                });
                return;
            }

            try {
                UUIDValidator.validate(body.userId);
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error instanceof Error ? error.message : "Invalid user ID",
                    timestamp: new Date().toISOString(),
                });
                return;
            }

            const result = await this.rpkmUsecase.register(body);
            res.status(201).json({
                success: true,
                message: "RPKM workshop registered successfully.",
                data: {
                    id: result.id,
                    userId: result.userId,
                    workshopType: result.workshopType,
                    workshopTime: result.workshopTime,
                },
                timestamp: new Date().toISOString(),
            });
        }
        catch(error) {
            console.log("RPKM workshop registration error: ", error);
            if(error instanceof Error){
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: "Internal server error",
                timestamp: new Date().toISOString(),
            });
        }
    }

    async getWorkshopsOfUserId(req: AuthenticatedRequest, res: Response): Promise<void> {
        try{
            const userId = req.user?.id;
            if(!userId){
                res.status(401).json({
                    success: false,
                    error: "User not authenticated.",
                    timestamp: new Date().toISOString(),
                });
                return;
            }

            const paramUserId = req.params.userId;
            if(!paramUserId){
                res.status(400).json({
                    success: false,
                    error: "Null userId in request params.",
                    timestamp: new Date().toISOString(),
                });
                return;
            }

            try {
                UUIDValidator.validate(paramUserId);
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: error instanceof Error ? error.message : "Invalid user ID",
                    timestamp: new Date().toISOString(),
                });
                return;
            }

            const result = await this.rpkmUsecase.getWorkshopsByUserId(paramUserId);
            res.status(201).json({
                success: true,
                message: "Successfully retrieved user's registered RPKM workshops.",
                data: result,
                timestamp: new Date().toISOString(),
            });
        }
        catch(error) {
            console.log(`User's registered RPKM workshops retrieval error: `, error);
            if(error instanceof Error){
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: "Internal server error",
                timestamp: new Date().toISOString(),
            });
        }        
    }

    async getWorkshopsParticipantCounts(res: Response): Promise<void> {
        try{
            const result = await this.rpkmUsecase.getWorkshopParticipantCounts();
            res.status(200).json({
                success: true,
                message: "Successfully retrieved participant counts of RPKM workshops.",
                data: result,
                timestamp: new Date().toISOString(),
            });
        }
        catch(error) {
            console.log(`RPKM workshops participant counts retrieval error: `, error);
            if(error instanceof Error){
                res.status(400).json({
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });
                return;
            }

            res.status(500).json({
                success: false,
                error: "Internal server error",
                timestamp: new Date().toISOString(),
            });
        }
    }
}