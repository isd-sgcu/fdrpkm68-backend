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

    const operations = await query(
        `WITH group_state AS (
            SELECT ${house_rank_column} AS current_house_id, submitted, group_member_count,
            array_remove( ARRAY[house_rank_1, house_rank_2, house_rank_3, 
                house_rank_4, house_rank_5, house_rank_6], NULL ) AS all_houses
            FROM groups
            WHERE group_id = $1
        ),
        conditions AS (
            SELECT current_house_id, submitted, group_member_count,
            $2 = ANY(all_houses) AND $2 IS DISTINCT FROM current_house_id AS exists_in_other_rank,
            $2 IS NOT DISTINCT FROM current_house_id AS same_as_current
            FROM group_state
        ),
        update_operations AS (
            UPDATE groups g
            SET ${house_rank_column} = $2
            FROM conditions c
            WHERE g.group_id = $1
            AND NOT c.submitted
            AND NOT c.exists_in_other_rank
            AND NOT c.same_as_current
            RETURNING g.${house_rank_column}
        ),
        house_update AS (
            UPDATE houses h
            SET member_count = member_count + COALESCE((SELECT group_member_count FROM conditions WHERE NOT same_as_current AND NOT exists_in_other_rank), 0)
            FROM update_operations u
            WHERE h.house_id = $2
            RETURNING h.house_id
        )
        SELECT 
            EXISTS(SELECT 1 FROM group_state) AS group_exists,
            COALESCE((SELECT submitted FROM conditions), true) AS submitted,
            COALESCE((SELECT exists_in_other_rank FROM conditions), false) AS exists_in_other_rank,
            COALESCE((SELECT same_as_current FROM conditions), false) AS same_as_current,
            (SELECT COUNT(*) > 0 FROM update_operations) AS updated_group,
            (SELECT COUNT(*) > 0 FROM house_update) AS updated_house`,
        [group_id, new_house_id]
    )

    const {
        group_exists,
        submitted,
        exists_in_other_rank,
        same_as_current,
        updated_group,
        updated_house
    } = operations.rows[0];
    if(!group_exists){
        return `Group id ${group_id} doesn't exists.`
    }
    if(submitted){
        return `Group id ${group_id} has already submitted.`
    }
    if(exists_in_other_rank){
        return `Group id ${group_id} already selected house id ${new_house_id} in another rank.`
    }
    if(same_as_current || (updated_group && updated_house)){
        return ''
    }
    return 'Something went wrong while querying database.'
}

export const deleteOneGroupHouseOnDB = async(group_id: string, rank_to_delete: number): Promise<string> => {
    rank_to_delete = rank_to_delete + 1
    let rank_column = `house_rank_${rank_to_delete}`

    const operations = await query(
        `WITH group_state AS (
            SELECT group_id, submitted, group_member_count, ${rank_column} AS current_house_id
            FROM groups
            WHERE group_id = $1
        ),
        to_delete AS (
            -- only if not yet submitted AND there's actually a house in that slot
            SELECT group_id, group_member_count, current_house_id
            FROM group_state
            WHERE submitted = false
            AND current_house_id IS NOT NULL
        ),
        decrease_member AS (
            UPDATE houses h
            SET member_count = GREATEST(h.member_count - t.group_member_count, 0)
            FROM to_delete t
            WHERE h.house_id = t.current_house_id
            RETURNING h.house_id
        ),
        set_rank_to_null AS (
            UPDATE groups g
            SET ${rank_column} = NULL
            FROM to_delete t
            WHERE g.group_id = t.group_id
            RETURNING g.group_id
        )
        SELECT
            (SELECT submitted FROM group_state) AS submitted,
            (SELECT COUNT(*) > 0 FROM decrease_member) AS decreased,
            (SELECT COUNT(*) > 0 FROM set_rank_to_null) AS set_to_null`,
        [group_id]
    )
    const {
        submitted
    } = operations.rows[0]
    if(submitted){
        return `Group id ${group_id} has already submitted.`
    }
    return ''
}

export const deleteAllGroupHousesOnDB = async(group_id: string): Promise<string> => {
    // const operations = await query(
    //     `WITH check_target AS (
    //         SELECT group_id, group_member_count,
    //             unnest(array_remove(ARRAY[house_rank_1, house_rank_2, house_rank_3,
    //                                     house_rank_4, house_rank_5, house_rank_6], NULL)) AS house_id
    //         FROM groups
    //         WHERE group_id = $1 AND submitted = false
    //     ),
    //     decrease_members AS (
    //         UPDATE houses h
    //         SET h.member_count = GREATEST(h.member_count - t.group_member_count, 0)
    //         FROM check_target t
    //         WHERE h.house_id = t.house_id
    //         RETURNING h.member_count
    //     ),
    //     set_all_to_null AS (
    //         UPDATE groups
    //         SET house_rank_1 = NULL, house_rank_2 = NULL, house_rank_3 = NULL, 
    //             house_rank_4 = NULL, house_rank_5 = NULL, house_rank_6 = NULL
    //         WHERE group_id IN (SELECT group_id from check_target)
    //         RETURNING group_id
    //     )
    //     SELECT 
    //         (SELECT submitted FROM check_target) AS submitted,
    //         (SELECT COUNT(*) > 0 FROM decrease_members) AS decreased,
    //         (SELECT COUNT(*) > 0 FROM set_all_to_null) AS set_nulls `,
    //     [group_id]
    // )
    const operations = await query(
        `WITH group_state AS (
            SELECT group_id, submitted, group_member_count, 
            array_remove(ARRAY[house_rank_1, house_rank_2, house_rank_3, house_rank_4, house_rank_5, house_rank_6], NULL) AS house_ids
            FROM groups WHERE group_id = $1
        ),
        decrease_members AS (
            UPDATE houses
            SET member_count = GREATEST(member_count - (SELECT group_member_count FROM group_state), 0)
            WHERE house_id IN (
                SELECT unnest(house_ids) FROM group_state
                WHERE submitted = false
            )
            RETURNING house_id
        ),
        set_all_to_null AS (
            UPDATE groups g
            SET house_rank_1 = NULL, house_rank_2 = NULL, house_rank_3 = NULL, 
                house_rank_4 = NULL, house_rank_5 = NULL, house_rank_6 = NULL
            FROM group_state gs
            WHERE g.group_id = gs.group_id AND gs.submitted = false
            RETURNING g.group_id
        )
        SELECT 
            (SELECT submitted FROM group_state) AS submitted,
            (SELECT COUNT(*) > 0 FROM decrease_members) AS decreased,
            (SELECT COUNT(*) > 0 FROM set_all_to_null) AS set_nulls`,
        [group_id]
    )
    const {
        submitted
    } = operations.rows[0]
    if(submitted){
        return `Group id ${group_id} has already submitted.`
    }
    return ''
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