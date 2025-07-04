import { query } from "../database/client";
import { CustomError } from "../types/error";
import { Group } from "../types/group";
import { User } from "../types/user";

export const getGroupDataFromDB = async(groupID: string): Promise<(string | null)[]> => {
 try {
    const result = await query(
      `SELECT * FROM groups WHERE group_id = $1`,
      [groupID]
    );
    return result.rows;
  } catch (error) {
    const customError: CustomError = new Error('Failed to find group by group ID');
    customError.statusCode = 500;
    throw customError;
  }
}

export const createOwnUserGroup = async(groupID: string, user: User): Promise<string> => {
  try {

    // TODO: maybe split these up?
    await query(`UPDATE users SET group_id = $1 WHERE student_id = $2 AND citizen_id = $3`, 
      [groupID,user.student_id,user.citizen_id]
    );
    
    const result = await query(
      `INSERT INTO 
      groups (group_id, submitted) 
      VALUES ($1, FALSE)`,
      [groupID]
    );
    return result.rows[0];
  } catch (error) {
    const customError: CustomError = new Error('Failed to create group.');
    customError.statusCode = 500;
    throw customError;
  }
}