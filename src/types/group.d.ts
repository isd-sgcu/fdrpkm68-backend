import { GroupRoleType } from "./enum";

export interface Group {
    id: string,
    selected_houses: string[] // keep Thai names of selected houses, in order from first rank to last
}