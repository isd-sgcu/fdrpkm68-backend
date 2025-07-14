import { RPKMworkshop, WorkshopType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { workshopParticipantCountType, _rawWorkshopParticipantCountType } from "@/types/rpkm/GET";
import { WorkshopRegisterRequest } from "@/types/rpkm/POST";

export class RpkmRepository {
    async userRegisterNewWorkshop(body: WorkshopRegisterRequest, userId: string): Promise<RPKMworkshop> {
        try{
            const register = await prisma.rPKMworkshop.create({
                data: {
                    workshopType: body.workshopType,
                    workshopTime: body.workshopTime,
                    userId: userId
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
            const workshops = await prisma.rPKMworkshop.findMany({
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
            const allTypes = Object.values(WorkshopType);
            const baseCounts: Record<WorkshopType, number> = {} as Record<WorkshopType, number>;
            allTypes.forEach((type: WorkshopType) => {
                baseCounts[type] = 0;
            });

            const result = await prisma.rPKMworkshop.groupBy({
                by: ['workshopType'],
                _count: {
                    _all: true,
                },
            });
            result.forEach((row: _rawWorkshopParticipantCountType) => {
                baseCounts[row.workshopType] = row._count._all
            });

            return allTypes.map((type: WorkshopType) => ({
                workshopType: type,
                count: baseCounts[type]
            } as workshopParticipantCountType));
        }
        catch(error) {
            console.log(`Error getting participant counts of RPKM workshops: `, error);
            throw new Error(`Failed to get participant counts of RPKM workshops.`);
        }
    }

    async getUserWorkshopConflicts(body: WorkshopRegisterRequest, userId: string): Promise<RPKMworkshop[][]> {
        try {
            const [workshopDuplicate, timeSlotDuplicate] = await prisma.$transaction([
                prisma.rPKMworkshop.findMany({
                    where: {
                        workshopType: body.workshopType,
                        userId: userId
                    }
                }),
                prisma.rPKMworkshop.findMany({
                    where: {
                        workshopTime: body.workshopTime,
                        userId: userId
                    }
                })
            ]);

            return [workshopDuplicate, timeSlotDuplicate];
        }
        catch(error) {
            console.log(`Error checking workshop time/type conflicts of user id ${userId}: `, error);
            throw new Error(`Failed to check workshop time/type conflicts of user id ${userId}.`);           
        }
    }
}