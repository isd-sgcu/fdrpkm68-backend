import { Group, House, User } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { GroupRepository } from "@/repository/group/groupRepository";
import { HouseRepository } from "@/repository/house/houseRepository";
import { AppError } from "@/types/error/AppError";
import { InviteCodeGenerator } from "@/utils/inviteCodeGenerator";

export class GroupUsecase {
  private groupRepository: GroupRepository;
  private houseRepository: HouseRepository;

  constructor() {
    this.groupRepository = new GroupRepository();
    this.houseRepository = new HouseRepository();
  }

  async createGroupForUser(userId: string): Promise<Group> {
    try {
      const existingGroup = await this.groupRepository.findUserGroup(userId);
      if (existingGroup?.ownerId === userId) {
        throw new Error("User already owns a group");
      }

      if (existingGroup) {
        await this.groupRepository.removeUserFromGroup(
          userId,
          existingGroup.id
        );
      }

      return await this.groupRepository.createGroupForUser(userId);
    } catch (error) {
      console.error("Error in createGroupForUser:", error);
      throw new AppError(
        `Failed to create group for user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async getUserGroup(userId: string): Promise<
    | (Group & {
        owner: User;
        users: User[];
        house1: House | null;
        house2: House | null;
        house3: House | null;
        house4: House | null;
        house5: House | null;
        houseSub: House | null;
      })
    | null
  > {
    try {
      return await this.groupRepository.findUserGroup(userId);
    } catch (error) {
      console.error("Error getting user group:", error);
      throw new AppError(
        `Failed to get user group: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async getGroupByGroupId(groupId: string): Promise<
    | (Group & {
        owner: User;
        users: User[];
        house1: House | null;
        house2: House | null;
        house3: House | null;
        house4: House | null;
        house5: House | null;
        houseSub: House | null;
      })
    | null
  > {
    try {
      return await this.groupRepository.findGroupById(groupId);
    } catch (error) {
      console.error("Error getting group by ID:", error);
      throw new AppError(
        `Failed to get group by ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async getGroupByInviteCode(inviteCode: string): Promise<Group | null> {
    const data = await this.groupRepository.findGroupByInviteCode(inviteCode);
    if (!data) {
      throw new AppError("Group not found with the provided invite code", 404);
    }
    const group = await this.groupRepository.findUserGroup(data?.ownerId);
    if (!group) {
      throw new AppError("Group not found with the provided invite code", 404);
    }
    if (group.isConfirmed) {
      throw new AppError("Cannot join a confirmed group", 403);
    }
    if (group.memberCount >= 3) {
      throw new AppError("Group is at maximum capacity (3 members)", 403);
    }
    return group;
  }

  async createGroup(userId: string): Promise<Group> {
    try {
      const existingGroup = await this.groupRepository.findUserGroup(userId);
      if (existingGroup?.ownerId === userId) {
        throw new Error("User already owns a group");
      }

      if (existingGroup) {
        throw new Error(
          "User must leave current group before creating a new one"
        );
      }

      return await this.groupRepository.createGroupForUser(userId);
    } catch (error) {
      console.error("Error creating group:", error);
      throw new AppError(
        `Failed to create group: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async joinGroup(userId: string, inviteCode: string): Promise<void> {
    try {
      if (!InviteCodeGenerator.isValidFormat(inviteCode)) {
        throw new Error("Invalid invite code format");
      }

      const targetGroup = await this.groupRepository.findGroupByInviteCode(
        inviteCode
      );
      if (!targetGroup) {
        throw new Error("Invalid invite code");
      }

      if (targetGroup.isConfirmed) {
        throw new Error("Cannot join a confirmed group");
      }

      if (targetGroup.memberCount >= 3) {
        throw new Error("Group is at maximum capacity (3 members)");
      }

      const currentGroup = await this.groupRepository.findUserGroup(userId);
      if (currentGroup && currentGroup.memberCount !== 1) {
        throw new Error(
          "User is already in a group. Leave current group first."
        );
      }

      if (targetGroup.ownerId === userId) {
        throw new Error("Cannot join your own group");
      }

      const currentGroupHouseIds = [
        currentGroup?.houseRank1 ?? null,
        currentGroup?.houseRank2 ?? null,
        currentGroup?.houseRank3 ?? null,
        currentGroup?.houseRank4 ?? null,
        currentGroup?.houseRank5 ?? null,
        currentGroup?.houseRankSub ?? null,
      ].filter((id) => id !== null && id !== undefined) as string[];

      const targetGroupHouseIds = [
        targetGroup.houseRank1 ?? null,
        targetGroup.houseRank2 ?? null,
        targetGroup.houseRank3 ?? null,
        targetGroup.houseRank4 ?? null,
        targetGroup.houseRank5 ?? null,
        targetGroup.houseRankSub ?? null,
      ].filter((id) => id !== null && id !== undefined) as string[];

      await prisma.$transaction(async (tx) => {
        if (currentGroup) {
          await this.groupRepository.removeUserFromGroup(
            userId,
            currentGroup.id,
            tx
          );
          await this.houseRepository.decrementChosenCounts(
            currentGroupHouseIds,
            1,
            tx
          );
        }

        await this.groupRepository.addUserToGroup(userId, targetGroup.id, tx);
        await this.houseRepository.incrementChosenCounts(
          targetGroupHouseIds,
          1,
          tx
        );
      });
    } catch (error) {
      console.error("Error joining group:", error);
      throw new AppError(
        `Failed to join group: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    try {
      const currentGroup = await this.getGroupByGroupId(groupId);
      if (!currentGroup) {
        throw new Error("User is not in any group");
      }

      if (currentGroup.isConfirmed) {
        throw new Error("Cannot leave a confirmed group");
      }

      if (currentGroup.ownerId === userId) {
        throw new Error("Group owner cannot leave their own group");
      }

      const houseIds = [
        currentGroup?.houseRank1 ?? null,
        currentGroup?.houseRank2 ?? null,
        currentGroup?.houseRank3 ?? null,
        currentGroup?.houseRank4 ?? null,
        currentGroup?.houseRank5 ?? null,
        currentGroup?.houseRankSub ?? null,
      ].filter((id) => id !== null && id !== undefined) as string[];

      await prisma.$transaction(async (tx) => {
        await this.groupRepository.removeUserFromGroup(
          userId,
          currentGroup.id,
          tx
        );
        await this.houseRepository.decrementChosenCounts(houseIds, 1, tx);
        await this.groupRepository.createGroupForUser(userId, tx);
      });
    } catch (error) {
      console.error("Error leaving group:", error);
      throw new AppError(
        `Failed to leave group: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async kickMember(ownerId: string, memberUserId: string): Promise<void> {
    try {
      const ownerGroup = await this.groupRepository.findUserGroup(ownerId);
      if (!ownerGroup) {
        throw new Error("Owner is not in any group");
      }

      if (ownerGroup.ownerId !== ownerId) {
        throw new Error("Only group owner can kick members");
      }

      if (ownerGroup.isConfirmed) {
        throw new Error("Cannot kick members from a confirmed group");
      }

      const memberInGroup = ownerGroup.users.some(
        (user) => user.id === memberUserId
      );
      if (!memberInGroup) {
        throw new Error("User is not a member of this group");
      }

      if (memberUserId === ownerId) {
        throw new Error("Cannot kick the group owner");
      }

      const houseIds = [
        ownerGroup.houseRank1 ?? null,
        ownerGroup.houseRank2 ?? null,
        ownerGroup.houseRank3 ?? null,
        ownerGroup.houseRank4 ?? null,
        ownerGroup.houseRank5 ?? null,
        ownerGroup.houseRankSub ?? null,
      ].filter((id) => id !== null && id !== undefined) as string[];

      await prisma.$transaction(async (tx) => {
        await this.groupRepository.removeUserFromGroup(
          memberUserId,
          ownerGroup.id,
          tx
        );
        await this.houseRepository.decrementChosenCounts(houseIds, 1, tx);
        await this.groupRepository.createGroupForUser(memberUserId, tx);
      });
    } catch (error) {
      console.error("Error kicking member:", error);
      throw new AppError(
        `Failed to kick member: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async confirmGroup(userId: string): Promise<Group> {
    try {
      const userGroup = await this.groupRepository.findUserGroup(userId);
      if (!userGroup) {
        throw new Error("User is not in any group");
      }

      if (userGroup.ownerId !== userId) {
        throw new Error("Only group owner can confirm the group");
      }

      if (userGroup.isConfirmed) {
        throw new Error("Group is already confirmed");
      }

      return await this.groupRepository.confirmGroup(userGroup.id);
    } catch (error) {
      console.error("Error confirming group:", error);
      throw new AppError(
        `Failed to confirm group: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async regenerateInviteCode(userId: string): Promise<string> {
    try {
      const userGroup = await this.groupRepository.findUserGroup(userId);
      if (!userGroup) {
        throw new Error("User is not in any group");
      }

      if (userGroup.ownerId !== userId) {
        throw new Error("Only group owner can regenerate invite code");
      }

      if (userGroup.isConfirmed) {
        throw new Error("Cannot regenerate invite code for confirmed group");
      }

      return await this.groupRepository.regenerateInviteCode(userGroup.id);
    } catch (error) {
      console.error("Error regenerating invite code:", error);
      throw new AppError(
        `Failed to regenerate invite code: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async getInviteCode(userId: string): Promise<string> {
    try {
      const userGroup = await this.groupRepository.findUserGroup(userId);
      if (!userGroup) {
        throw new Error("User is not in any group");
      }

      return userGroup.inviteCode;
    } catch (error) {
      console.error("Error getting invite code:", error);
      throw new AppError(
        `Failed to get invite code: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async setHousePreferences(
    userId: string,
    preferences: {
      houseRank1?: string | null;
      houseRank2?: string | null;
      houseRank3?: string | null;
      houseRank4?: string | null;
      houseRank5?: string | null;
      houseRankSub?: string | null;
    }
  ): Promise<Group> {
    try {
      const userGroup = await this.groupRepository.findUserGroup(userId);
      if (!userGroup) {
        throw new Error("User is not in any group");
      }

      if (userGroup.ownerId !== userId) {
        throw new Error("Only group owner can set house preferences");
      }

      if (userGroup.isConfirmed) {
        throw new Error("Cannot change house preferences for confirmed group");
      }

      const houseIds = Object.values(preferences).filter(
        (id) => id !== null && id !== undefined
      );
      if (houseIds.length > 0) {
        const validHouses = await this.houseRepository.validateHouseIds(
          houseIds
        );
        if (!validHouses) {
          throw new Error("One or more house IDs are invalid");
        }
      }

      const uniqueRanks = new Set(houseIds);
      if (houseIds.length !== uniqueRanks.size) {
        throw new Error(
          "Cannot select the same house for multiple ranks (1-5)"
        );
      }

      // ไม่ต้องเรียงอันดับให้ ถ้ามัน null ก็ปล่อยไป
      // const ranks1to6 = [...houseIds, ...Array(6 - houseIds.length).fill(null)];

      return await prisma.$transaction(async (tx) => {
        const currentPreferences = {
          houseRank1: userGroup.houseRank1,
          houseRank2: userGroup.houseRank2,
          houseRank3: userGroup.houseRank3,
          houseRank4: userGroup.houseRank4,
          houseRank5: userGroup.houseRank5,
          houseRankSub: userGroup.houseRankSub,
        };

        const normalizedPreferences = {
          houseRank1: preferences.houseRank1 ?? null,
          houseRank2: preferences.houseRank2 ?? null,
          houseRank3: preferences.houseRank3 ?? null,
          houseRank4: preferences.houseRank4 ?? null,
          houseRank5: preferences.houseRank5 ?? null,
          houseRankSub: preferences.houseRankSub ?? null,
        };

        await this.houseRepository.updateChosenCountsForPreferenceChange(
          currentPreferences,
          normalizedPreferences,
          userGroup.memberCount,
          tx
        );

        return await this.groupRepository.updateHousePreferences(
          userGroup.id,
          normalizedPreferences,
          tx
        );
      });
    } catch (error) {
      console.error("Error setting house preferences:", error);
      throw new AppError(
        `Failed to set house preferences: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async getAllHouses(): Promise<House[]> {
    try {
      return await this.houseRepository.getAllHouses();
    } catch (error) {
      console.error("Error getting all houses:", error);
      throw new AppError(
        `Failed to get all houses: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async getHousePreferences(userId: string): Promise<{
    houseRank1: House | null;
    houseRank2: House | null;
    houseRank3: House | null;
    houseRank4: House | null;
    houseRank5: House | null;
    houseRankSub: House | null;
  }> {
    try {
      const userGroup = await this.groupRepository.findUserGroup(userId);
      if (!userGroup) {
        throw new Error("User is not in any group");
      }

      return {
        houseRank1: userGroup.house1,
        houseRank2: userGroup.house2,
        houseRank3: userGroup.house3,
        houseRank4: userGroup.house4,
        houseRank5: userGroup.house5,
        houseRankSub: userGroup.houseSub,
      };
    } catch (error) {
      console.error("Error getting house preferences:", error);
      throw new AppError(
        `Failed to get house preferences: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }
}
