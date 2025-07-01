import { table } from "console";
import { HouseSizeType } from "./enum";

export interface House {
    name_Thai: string,
    name_English: string,
    logo: string, // In what format are we going to keep logo picture of house?
    description_Thai: string,
    description_English: string,
    size_letter: HouseSizeType,
    member_count: integer, // current number of people selecting the house (front-end update every 6 hours?)
    max_member: integer, // max number of member for corresponding house size letter
    instagram: string // house's instagram link
}
