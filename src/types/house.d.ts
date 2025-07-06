import { table } from "console";
import { HouseSizeType } from "./enum";

export interface House {
    house_id: string,
    name_thai: string,
    name_english: string,
    description_thai: string,
    description_english: string,
    size_letter: HouseSizeType,
    member_count: integer, // current number of people selecting the house
    max_member: integer, // max number of member for corresponding house size letter
    instagram?: string | null,
    facebook?: string | null,
    tiktok?: string | null
}
