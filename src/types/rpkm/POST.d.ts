import { WorkshopType } from "@prisma/client";

export interface WorkshopRegisterRequest {
    workshopType: WorkshopType;
    userId: string;
    workshopTime: number;
}