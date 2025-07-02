import { query } from "../database/client";
import { CustomError } from "../types/error";
import { Group } from "../types/group";

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