import { WorkshopType } from "@prisma/client";

export interface WorkshopRegisterRequest {
    workshopType: WorkshopType;
    workshopTime: number;
}