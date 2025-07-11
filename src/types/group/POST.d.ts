import { ApiResponse } from "./GET";

export interface CreateGroupRequest {
}

export interface JoinGroupRequest {
  inviteCode: string;
}

export interface KickMemberRequest {
  userId: string;
}

export interface ConfirmGroupRequest {
}

export interface RegenerateInviteCodeRequest {
}

export interface SetHousePreferencesRequest {
  houseRank1?: string | null;
  houseRank2?: string | null;
  houseRank3?: string | null;
  houseRank4?: string | null;
  houseRank5?: string | null;
  houseRankSub?: string | null;
}

export interface CreateGroupResponse {
  id: string;
  ownerId: string;
  inviteCode: string;
  memberCount: number;
  isConfirmed: boolean;
}

export interface JoinGroupResponse {
  groupId: string;
  memberCount: number;
  message: string;
}

export interface KickMemberResponse {
  kickedUserId: string;
  newMemberCount: number;
  message: string;
}

export interface ConfirmGroupResponse {
  groupId: string;
  isConfirmed: boolean;
  message: string;
}

export interface RegenerateInviteCodeResponse {
  newInviteCode: string;
  message: string;
}

export interface SetHousePreferencesResponse {
  groupId: string;
  updatedPreferences: {
    houseRank1: string | null;
    houseRank2: string | null;
    houseRank3: string | null;
    houseRank4: string | null;
    houseRank5: string | null;
    houseRankSub: string | null;
  };
  message: string;
}

export type CreateGroupApiResponse = ApiResponse<CreateGroupResponse>;
export type JoinGroupApiResponse = ApiResponse<JoinGroupResponse>;
export type KickMemberApiResponse = ApiResponse<KickMemberResponse>;
export type ConfirmGroupApiResponse = ApiResponse<ConfirmGroupResponse>;
export type RegenerateInviteCodeApiResponse = ApiResponse<RegenerateInviteCodeResponse>;
export type SetHousePreferencesApiResponse = ApiResponse<SetHousePreferencesResponse>;

export type SuccessResponse = ApiResponse<{ message: string }>;

export interface HouseRankValidation {
  houseId: string | null;
  rank: number;
}

export interface HousePreferenceUpdate {
  oldPreferences: {
    houseRank1: string | null;
    houseRank2: string | null;
    houseRank3: string | null;
    houseRank4: string | null;
    houseRank5: string | null;
    houseRankSub: string | null;
  };
  newPreferences: {
    houseRank1: string | null;
    houseRank2: string | null;
    houseRank3: string | null;
    houseRank4: string | null;
    houseRank5: string | null;
    houseRankSub: string | null;
  };
}