import { WorkshopRegisterRequest } from "../../types/rpkm/POST";
import { UserRepository } from "../user/userRepository";
import { RPKMworkshop } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { WorkshopType } from "../../types/enum";
import { workshopParticipantCountType, _rawWorkshopParticipantCountType } from "../../types/rpkm/GET";

export class RpkmRepository {
    async userRegisterNewWorkshop(body: WorkshopRegisterRequest): Promise<RPKMworkshop> {
        try{
            const register = await prisma.rpkm_workshop.create({
                data: {
                    workshopType: body.workshopType,
                    workshopTime: body.workshopTime,
                    userId: body.userId
                }
            });
            return register;
        }
        catch(error) {
            console.log("Error registering for an RPKM workshop in: ", error);
            throw new Error("Failed to register for an RPKM workshop.");
        }
    }

    async getWorkshopsRegisteredByUserID(userId: string): Promise<RPKMworkshop[]> {
        try{
            const workshops = await prisma.rpkm_workshop.findMany({
                where: {
                    userId: userId
                }
            });
            return workshops;
        }
        catch(error) {
            console.log(`Error getting RPKM workshops registered by user id ${userId}: `, error);
            throw new Error(`Failed to get RPKM workshops registered by user id ${userId}.`);
        }
    }

    async getWorkshopsParticipantCounts(): Promise<workshopParticipantCountType[]> {
        try{
            const result = await prisma.rpkm_workshop.groupBy({
                by: ['workshopType'],
                _count: {
                    _all: true,
                },
            });
            const formatted = result.map((element: _rawWorkshopParticipantCountType) => ({
                workshopType: element.workshopType,
                count: element._count._all
            }));
            return formatted
        }
        catch(error) {
            console.log(`Error getting participant counts of RPKM workshops: `, error);
            throw new Error(`Failed to get participant counts of RPKM workshops.`);
        }
    }

    async getUserWorkshopConflicts(body: WorkshopRegisterRequest): Promise<RPKMworkshop[][]> {
        try {
            const [workshopDuplicate, timeSlotDuplicate] = await prisma.$transaction([
                prisma.rpkm_workshop.findMany({
                    where: {
                        workshopType: body.workshopType,
                        userId: body.userId
                    }
                }),
                prisma.rpkm_workshop.findMany({
                    where: {
                        workshopTime: body.workshopTime,
                        userId: body.userId
                    }
                })
            ]);

            return [workshopDuplicate, timeSlotDuplicate];
        }
        catch(error) {
            console.log(`Error checking workshop time/type conflicts of user id ${body.userId}: `, error);
            throw new Error(`Failed to check workshop time/type conflicts of user id ${body.userId}.`);           
        }
    }
}