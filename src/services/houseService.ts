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
    let house_rank_column = `house_rank_${rank}`

    const check_original_house_and_submitted = await query(
        `SELECT (${house_rank_column}, submitted) FROM groups
        WHERE group_id = $1`,
        [group_id]
    )
    let asArray = check_original_house_and_submitted.rows[0].row.slice(1, -1).split(",")
    const original_house_id = asArray[0] === '' ? null : asArray[0]
    const submitted = asArray[1] === 'f' ? false : true
    if(submitted){
        return `Group with id ${group_id} has already submitted selected houses.`
    }

    const check_max_member = await query(
        `SELECT member_count, max_member FROM houses
        WHERE house_id = $1
        AND member_count < max_member`,
        [new_house_id]
    )
    if(check_max_member.rowCount === 0){
        return `Either house with id ${new_house_id} is already full, or it doesn't exists.`
    }

    const update_rank = await query(
        `UPDATE groups
        SET ${house_rank_column} = $1
        WHERE group_id = $2
        AND NOT ($1 = ANY( array_remove( ARRAY[house_rank_1, house_rank_2, house_rank_3, 
            house_rank_4, house_rank_5, house_rank_6], NULL ) ))`,
        [new_house_id, group_id]
    )
    if(update_rank.rowCount === 0){
        return `Either group with id ${group_id} has already selected house with id ${new_house_id}, or it doesn't exists.`
    }

    const increment_member = await query(
        `UPDATE houses
        SET member_count = member_count + 1
        WHERE house_id = $1 AND member_count < max_member;`,
        [new_house_id]
    )
    if(increment_member.rowCount === 0){
        // This should only happen in a race condition 
        // (House with new_house_id hit max_member RIGHT AFTER passing through check_max_member and update_rank BUT BEFORE increment_member, 
        // so user has the house in their group even though they're not supposed to)
        // It should be rare and undo_update_rank should almost never get called
        const undo_update_rank = await query(
            `UPDATE groups
            SET ${house_rank_column} = $1
            WHERE group_id = $2
            AND NOT ($1 = ANY( array_remove( ARRAY[house_rank_1, house_rank_2, house_rank_3, 
                house_rank_4, house_rank_5, house_rank_6], NULL ) ))`,
            [original_house_id, group_id]
        )
    }
    return ''
}

export const deleteOneGroupHouseOnDB = async(group_id: string, rank_to_delete: number): Promise<Boolean> => {
    const check_submitted = await query(
        `SELECT submitted FROM groups WHERE group_id = $1`,
        [group_id]
    )
    if(check_submitted.rows[0].submitted){
        return false
    }
    
    rank_to_delete = rank_to_delete + 1
    const house_rank_column = `house_rank_${rank_to_delete}`
    const decrement_member = await query(
        `UPDATE houses
        SET member_count = GREATEST(member_count - 1, 0)
        WHERE house_id IN (
            SELECT ${house_rank_column} FROM groups WHERE group_id = $1 AND ${house_rank_column} IS NOT NULL
        )`,
        [group_id]
    )

    if(decrement_member.rowCount === 0){
        // Trying to delete a column with house_id = NULL will result in nothing changed
        // Not an exception, just that nothing should happen
        return true
    }

    const update_group = await query(
        `UPDATE groups
        SET ${house_rank_column} = NULL
        WHERE group_id = $1`,
        [group_id]
    )
    return update_group.rowCount === 1
}

export const deleteAllGroupHousesOnDB = async(group_id: string): Promise<Boolean> => {
    const check_submitted = await query(
        `SELECT submitted FROM groups WHERE group_id = $1`,
        [group_id]
    )
    if(check_submitted.rows[0].submitted){
        return false
    }

    const decrement_members = await query(
        `UPDATE houses
        SET member_count = GREATEST(member_count - 1, 0)
        WHERE house_id IN (
            SELECT house_rank_1 FROM groups WHERE group_id = $1 AND house_rank_1 IS NOT NULL
            UNION
            SELECT house_rank_2 FROM groups WHERE group_id = $1 AND house_rank_2 IS NOT NULL
            UNION
            SELECT house_rank_3 FROM groups WHERE group_id = $1 AND house_rank_3 IS NOT NULL
            UNION
            SELECT house_rank_4 FROM groups WHERE group_id = $1 AND house_rank_4 IS NOT NULL
            UNION
            SELECT house_rank_5 FROM groups WHERE group_id = $1 AND house_rank_5 IS NOT NULL
            UNION
            SELECT house_rank_6 FROM groups WHERE group_id = $1 AND house_rank_6 IS NOT NULL
        )`,
        [group_id]
    )

    const update_group = await query(
        `UPDATE groups
        SET house_rank_1 = NULL, house_rank_2 = NULL, house_rank_3 = NULL, 
            house_rank_4 = NULL, house_rank_5 = NULL, house_rank_6 = NULL
        WHERE group_id = $1`,
        [group_id]
    )
    return update_group.rowCount === 1
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