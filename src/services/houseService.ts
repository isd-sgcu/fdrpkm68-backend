import { query } from '../database/client'; 
import { House } from '../types/house';

export const getAllHousesFromDB = async(): Promise<House[]> => {
    const result = await query(
        `SELECT * FROM houses`
    );
    return result.rows
}

export const getSelectedHousesFromDB = async(group_id: string): Promise<(string | null)[]> => {
  // FIXME: Take a look at this someone, may not work  
  const result = await query(
        `SELECT * FROM houses WHERE house_id IN 
        (SELECT selected_houses FROM groups WHERE group_id = $1)`, 
        [group_id]
    );
    return result.rows
}

// export const saveHousesToDB = async(student_ids: string[], citizen_ids: string[]): Promise<string> => {
//     // Need frontend to make sure students_ids and citizen_ids are in corresponding order
//     // i.e., (student id 1 and citizen id 100) pairs with (student id 2 and citizen id 200)
//     // then expect student_ids = [1,2] and citizen_ids = [100,200]
//     for(let i = 0; i < student_ids.length; i++){
//         query(
//             `UPDATE users 
//             SET group = `
//         )
        
//     }
// }