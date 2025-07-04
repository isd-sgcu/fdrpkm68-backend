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

export const addOneGroupHouseOnDB = async(group_id: string, new_house_id: Number, rank: number): Promise<string> => {
    rank = rank + 1 // Array index in SQL starts with 1
    const validColumns = ['houses.house_rank_1', 'houses.house_rank_2', 'houses.house_rank_3', 'houses.house_rank_4', 'houses.house_rank_5', 'houses.house_rank_6']
    let house_rank_column = `house_rank_${rank}`

    const result = await query(
        `UPDATE groups
        SET groups.${house_rank_column} = $1, houses.member_count = houses.member_count + 1
        FROM houses
        WHERE groups.group_id = $2 AND houses.house_id = $1
        AND NOT ($1 = ANY( array_remove(ARRAY[${validColumns.join(', ')}], NULL) ))
        AND houses.member_count < houses.max_member`,
        [new_house_id, group_id, rank]
    )
    if(result.rowCount === 0){
        return `Either ${new_house_id} is already chosen in one of the ranks, or it's already full, or something else went wrong.`
    }

    // const add_member = await query(
    //     `UPDATE houses
    //     SET member_count = member_count + 1
    //     WHERE house_id = $1 AND member_count < max_member`,
    //     [new_house_id, group_id, rank]
    // )
    // if(add_member.rowCount === 0){
    //     return `Either house with id ${new_house_id} is already full, or it doesn't exists.`
    // }
    return ''
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