import { Group, User, House, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { InviteCodeGenerator } from "@/utils/inviteCodeGenerator";

export class GroupRepository {
  async findGroupById(groupId: string): Promise<Group & {
    owner: User;
    users: User[];
    house1: House | null;
    house2: House | null;
    house3: House | null;
    house4: House | null;
    house5: House | null;
    houseSub: House | null;
  } | null> {
    try {
      return await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          owner: true,
          users: true,
          house1: true,
          house2: true,
          house3: true,
          house4: true,
          house5: true,
          houseSub: true,
        },
      });
    } catch (error) {
      console.error("Error finding group by ID:", error);
      throw new Error("Failed to find group");
    }
  }

  async findGroupByInviteCode(inviteCode: string): Promise<Group | null> {
    try {
      const normalizedCode = InviteCodeGenerator.normalize(inviteCode);
      return await prisma.group.findUnique({
        where: { inviteCode: normalizedCode },
      });
    } catch (error) {
      console.error("Error finding group by invite code:", error);
      throw new Error("Failed to find group by invite code");
    }
  }

  async findUserGroup(userId: string): Promise<Group & {
    owner: User;
    users: User[];
    house1: House | null;
    house2: House | null;
    house3: House | null;
    house4: House | null;
    house5: House | null;
    houseSub: House | null;
  } | null> {
    try {
      const ownedGroup = await prisma.group.findUnique({
        where: { ownerId: userId },
        include: {
          owner: true,
          users: true,
          house1: true,
          house2: true,
          house3: true,
          house4: true,
          house5: true,
          houseSub: true,
        },
      });

      if (ownedGroup) return ownedGroup;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          group: {
            include: {
              owner: true,
              users: true,
              house1: true,
              house2: true,
              house3: true,
              house4: true,
              house5: true,
              houseSub: true,
            },
          },
        },
      });

      return user?.group || null;
    } catch (error) {
      console.error("Error finding user group:", error);
      throw new Error("Failed to find user group");
    }
  }

  async createGroupForUser(userId: string): Promise<Group> {
    try {
      return await prisma.$transaction(async (tx) => {
        const inviteCode = await InviteCodeGenerator.generate();

        const group = await tx.group.create({
          data: {
            ownerId: userId,
            inviteCode,
            memberCount: 1,
            isConfirmed: false,
          },
        });

        await tx.user.update({
          where: { id: userId },
          data: { groupId: group.id },
        });

        return group;
      });
    } catch (error) {
      console.error("Error creating group for user:", error);
      throw new Error("Failed to create group");
    }
  }

  async addUserToGroup(userId: string, groupId: string): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: { groupId },
        });

        await tx.group.update({
          where: { id: groupId },
          data: {
            memberCount: {
              increment: 1,
            },
          },
        });
      });
    } catch (error) {
      console.error("Error adding user to group:", error);
      throw new Error("Failed to add user to group");
    }
  }

  async removeUserFromGroup(userId: string, groupId: string): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: { groupId: null },
        });

        await tx.group.update({
          where: { id: groupId },
          data: {
            memberCount: {
              decrement: 1,
            },
          },
        });
      });
    } catch (error) {
      console.error("Error removing user from group:", error);
      throw new Error("Failed to remove user from group");
    }
  }

  async confirmGroup(groupId: string): Promise<Group> {
    try {
      return await prisma.group.update({
        where: { id: groupId },
        data: { isConfirmed: true },
      });
    } catch (error) {
      console.error("Error confirming group:", error);
      throw new Error("Failed to confirm group");
    }
  }

  async regenerateInviteCode(groupId: string): Promise<string> {
    try {
      const newInviteCode = await InviteCodeGenerator.generate();
      
      await prisma.group.update({
        where: { id: groupId },
        data: { inviteCode: newInviteCode },
      });

      return newInviteCode;
    } catch (error) {
      console.error("Error regenerating invite code:", error);
      throw new Error("Failed to regenerate invite code");
    }
  }

  async updateHousePreferences(
    groupId: string,
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
      return await prisma.group.update({
        where: { id: groupId },
        data: preferences,
      });
    } catch (error) {
      console.error("Error updating house preferences:", error);
      throw new Error("Failed to update house preferences");
    }
  }

  async getGroupMemberCount(groupId: string): Promise<number> {
    try {
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        select: { memberCount: true },
      });

      return group?.memberCount || 0;
    } catch (error) {
      console.error("Error getting group member count:", error);
      throw new Error("Failed to get group member count");
    }
  }

  async isGroupConfirmed(groupId: string): Promise<boolean> {
    try {
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        select: { isConfirmed: true },
      });

      return group?.isConfirmed || false;
    } catch (error) {
      console.error("Error checking group confirmation status:", error);
      throw new Error("Failed to check group confirmation status");
    }
  }

  async isGroupOwner(userId: string, groupId: string): Promise<boolean> {
    try {
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        select: { ownerId: true },
      });

      return group?.ownerId === userId;
    } catch (error) {
      console.error("Error checking group ownership:", error);
      throw new Error("Failed to check group ownership");
    }
  }

  async getGroupMembers(groupId: string): Promise<User[]> {
    try {
      return await prisma.user.findMany({
        where: { groupId },
        select: {
          id: true,
          studentId: true,
          firstName: true,
          lastName: true,
          nickname: true,
        },
      });
    } catch (error) {
      console.error("Error getting group members:", error);
      throw new Error("Failed to get group members");
    }
  }

  async deleteGroup(groupId: string): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.user.updateMany({
          where: { groupId },
          data: { groupId: null },
        });

        await tx.group.delete({
          where: { id: groupId },
        });
      });
    } catch (error) {
      console.error("Error deleting group:", error);
      throw new Error("Failed to delete group");
    }
  }
}