import { WorkshopType } from "@prisma/client"

export interface workshopParticipantCountType {
    workshopType: WorkshopType;
    count: number;
}

// For result returned by Prisma, used while converting result to workshopParticipantCountType
export interface _rawWorkshopParticipantCountType {
    workshopType: WorkshopType;
    _count: {
        _all: number,
    };
}