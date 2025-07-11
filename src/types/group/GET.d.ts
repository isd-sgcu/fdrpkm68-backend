import { Group, User, House } from "@prisma/client";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface GroupWithDetails {
  id: string;
  ownerId: string;
  isConfirmed: boolean;
  inviteCode: string;
  memberCount: number;
  houseRank1: string | null;
  houseRank2: string | null;
  houseRank3: string | null;
  houseRank4: string | null;
  houseRank5: string | null;
  houseRankSub: string | null;
  owner: {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    nickname: string;
  };
  users: Array<{
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    nickname: string;
  }>;
  house1?: HouseBasic | null;
  house2?: HouseBasic | null;
  house3?: HouseBasic | null;
  house4?: HouseBasic | null;
  house5?: HouseBasic | null;
  houseSub?: HouseBasic | null;
}

export interface HouseBasic {
  id: string;
  nameThai: string;
  nameEnglish: string;
  sizeLetter: string;
  capacity: number;
}

export interface HouseWithCount extends HouseBasic {
  chosenCount: number;
  descriptionThai: string;
  descriptionEnglish: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export interface GroupHousePreferences {
  groupId: string;
  houseRank1: HouseBasic | null;
  houseRank2: HouseBasic | null;
  houseRank3: HouseBasic | null;
  houseRank4: HouseBasic | null;
  houseRank5: HouseBasic | null;
  houseRankSub: HouseBasic | null;
}

export type GetGroupResponse = ApiResponse<GroupWithDetails>;
export type GetInviteCodeResponse = ApiResponse<{ inviteCode: string }>;
export type GetHousePreferencesResponse = ApiResponse<GroupHousePreferences>;
export type GetHousesResponse = ApiResponse<HouseWithCount[]>;

export interface ErrorResponse {
  success: false;
  error: string;
  timestamp: string;
}