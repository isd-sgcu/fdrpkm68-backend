import { query } from '../database/client'; 
import { House } from '../types/house';

export const getAllHousesFromDB = async(): Promise<House[]> => {
    const result = await query(
        `SELECT * FROM houses`
    );
    return result.rows
}

export const getCurrentMemberCountsFromDB = async(): Promise<any[]> => {
    const result = await query(
        `SELECT (house_id, member_count) FROM houses`
    )
    const arr = [] as any[]
    for(let i = 0; i < result.rows.length; i++){
        let rowAsArray = result.rows[i].row.slice(1, -1).split(",")
        arr[i] = {
            "house_id": rowAsArray[0],
            "member_count": parseInt(rowAsArray[1])
        }
    }
    return arr
}

export const getSelectedHousesIDsFromDB = async(group_id: string): Promise<(string | null)[]> => {
    const result = await query(
        `SELECT (house_rank_1, house_rank_2, house_rank_3, house_rank_4, house_rank_5, house_rank_6)
        FROM groups WHERE group_id = $1`,
        [group_id]
    )
    const arr = result.rows[0].row.slice(1, -1).split(",")
    for(let i = 0; i < arr.length; i++){
        if(arr[i] === ""){
            arr[i] = null
        }
    }
    return arr
}

export const updateGroupHouseOnDB = async(group_id: string, new_house_name: string, rank: number): Promise<Boolean> => {
    rank = rank + 1 // Array index in SQL starts with 1
    const add_member = await query(
        `SELECT @capacity = 
        UPDATE houses
        SET member_count = member_count + 1
        WHERE name_thai = $1`,
        [new_house_name]
    )
    const result = await query(
        `UPDATE groups
        SET selected_houses[$1] = $2
        WHERE group_id = $3
        AND NOT EXISTS (
            SELECT 1
            FROM unnest(selected_houses) WITH ORDINALITY AS t(house, idx)
            WHERE t.house = $2 AND t.idx <> $1
        )
        AND EXISTS (SELECT 1 FROM houses WHERE name_thai = $2)`,
        [rank, new_house_name, group_id]
    )
    return result.rowCount === 1
}

export const deleteOneGroupHouseOnDB = async(group_id: string, rank_to_delete: number): Promise<Boolean> => {
    rank_to_delete = rank_to_delete + 1
    const decrease_member = await query(
        `UPDATE houses
        SET member_count = MAX(member_count - 1, 0)
        FROM groups
        WHERE groups.group_id = $2
        AND houses.name_thai = group.selected_houses[$1]`,
        [rank_to_delete, group_id]
    )
    const result = await query(
        `UPDATE groups
        SET selected_houses[$2] = NULL
        WHERE group_id = $1`,
        [group_id, rank_to_delete]
    )
    return result.rowCount === 1
}

export const deleteAllGroupHousesOnDB = async(group_id: string): Promise<Boolean> => {
    // TODO: decrement member count for all houses previously in the list
    const result = await query(
        `UPDATE groups
        SET selected_houses = ARRAY[NULL, NULL, NULL, NULL, NULL, NULL]
        WHERE group_id = $1`,
        [group_id]
    )
    return result.rowCount === 1
}

export const submitGroupHousesToDB = async(group_id: string): Promise<Boolean> => {
    const result = await query(
        `UPDATE groups
        SET submitted = true
        WHERE group_id = $1`,
        [group_id]
    )
    return result.rowCount === 1
}

// const _decreaseMemberOneHouse = async: Promise<Boolean> => {
//     const result = await query(
//         `UPDATE houses
//         SET member_count = MAX(member_count - 1, 0)
//         WHERE house_id = $1`,
//         [house_id]
//     )
//     return result.rowCount === 1
// }

// const _decreaseMemberManyHouses = async(house_ids: string[])