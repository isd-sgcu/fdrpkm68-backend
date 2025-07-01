import { table } from "console";

export type HouseSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface House {
    name_Thai: string,
    name_English: string,
    logo: File,
    description_Thai: string,
    description_English: string,
    size_letter: HouseSize,
    member_count: integer, // current number of people selecting the house (front-end update every 6 hours?)
    max_member: integer, // max number of member for corresponding house size letter
    instagram: string // house's instagram link
}
