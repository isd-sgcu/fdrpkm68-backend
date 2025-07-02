import { GroupRoleType } from "./enum";
import { House } from "./house";

export interface Group {
    id: string,
    selected_houses: (string | null)[] // keep in order from first rank to last, default to array with 6 nulls
}