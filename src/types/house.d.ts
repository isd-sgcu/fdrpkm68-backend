import { table } from "console";
import { HouseSizeType } from "./enum";

export interface House {
    house_id: string,
    name_thai: string,
    name_english: string,
    logo: string, // In what format are we going to keep logo picture of house?
    description_thai: string,
    description_english: string,
    size_letter: HouseSizeType,
    member_count: integer, // current number of people selecting the house (front-end update every 6 hours?)
    max_member: integer, // max number of member for corresponding house size letter
    instagram: string // house's instagram link
}
