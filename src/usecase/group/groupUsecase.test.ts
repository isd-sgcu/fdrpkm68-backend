
import { GroupRepository } from "@/repository/group/groupRepository";
import { HouseRepository } from "@/repository/house/houseRepository";
import { InviteCodeGenerator } from "@/utils/inviteCodeGenerator";

import { GroupUsecase } from "./groupUsecase";

// Mock dependencies
jest.mock("@/repository/group/groupRepository");
jest.mock("@/repository/house/houseRepository");
jest.mock("@/utils/inviteCodeGenerator");
jest.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

describe("GroupUsecase", () => {
  let groupUsecase: GroupUsecase;
  let mockGroupRepository: jest.Mocked<GroupRepository>;
  let mockHouseRepository: jest.Mocked<HouseRepository>;

  beforeEach(() => {
    groupUsecase = new GroupUsecase();
    mockGroupRepository = new GroupRepository() as jest.Mocked<GroupRepository>;
    mockHouseRepository = new HouseRepository() as jest.Mocked<HouseRepository>;

    // Mock the repositories in the usecase
    (groupUsecase as any).groupRepository = mockGroupRepository;
    (groupUsecase as any).houseRepository = mockHouseRepository;

    jest.clearAllMocks();
  });

  describe("createGroupForUser", () => {
    it("should create group for user when they don't own one", async () => {
      const mockGroup = {
        id: "group-1",
        ownerId: "user-1",
        inviteCode: "ABC123",
        memberCount: 1,
        isConfirmed: false,
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      mockGroupRepository.findUserGroup.mockResolvedValue(null);
      mockGroupRepository.createGroupForUser.mockResolvedValue(mockGroup);

      const result = await groupUsecase.createGroupForUser("user-1");

      expect(result).toEqual(mockGroup);
      expect(result.ownerId).toBe("user-1");
      expect(result.memberCount).toBe(1);
      expect(result.isConfirmed).toBe(false);
      expect(mockGroupRepository.findUserGroup).toHaveBeenCalledWith("user-1");
      expect(mockGroupRepository.createGroupForUser).toHaveBeenCalledWith(
        "user-1"
      );
      expect(mockGroupRepository.removeUserFromGroup).not.toHaveBeenCalled();
    });

    it("should throw error if user already owns a group", async () => {
      const existingGroup = {
        id: "group-1",
        ownerId: "user-1",
        owner: {},
        users: [],
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      mockGroupRepository.findUserGroup.mockResolvedValue(existingGroup as any);

      await expect(groupUsecase.createGroupForUser("user-1")).rejects.toThrow(
        "User already owns a group"
      );

      expect(mockGroupRepository.findUserGroup).toHaveBeenCalledWith("user-1");
      expect(mockGroupRepository.createGroupForUser).not.toHaveBeenCalled();
      expect(mockGroupRepository.removeUserFromGroup).not.toHaveBeenCalled();
    });

    it("should remove user from existing group before creating new one", async () => {
      const existingGroup = {
        id: "group-1",
        ownerId: "user-2", // User is member, not owner
        owner: {},
        users: [],
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      const newGroup = {
        id: "group-2",
        ownerId: "user-1",
        inviteCode: "XYZ789",
        memberCount: 1,
        isConfirmed: false,
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      mockGroupRepository.findUserGroup.mockResolvedValue(existingGroup as any);
      mockGroupRepository.removeUserFromGroup.mockResolvedValue();
      mockGroupRepository.createGroupForUser.mockResolvedValue(newGroup);

      const result = await groupUsecase.createGroupForUser("user-1");

      expect(result).toEqual(newGroup);
      expect(result.ownerId).toBe("user-1");
      expect(mockGroupRepository.findUserGroup).toHaveBeenCalledWith("user-1");
      expect(mockGroupRepository.removeUserFromGroup).toHaveBeenCalledWith(
        "user-1",
        "group-1"
      );
      expect(mockGroupRepository.createGroupForUser).toHaveBeenCalledWith(
        "user-1"
      );

      // Verify call order
      const calls = jest.mocked(mockGroupRepository.removeUserFromGroup).mock
        .calls;
      const createCalls = jest.mocked(mockGroupRepository.createGroupForUser)
        .mock.calls;
      expect(calls.length).toBe(1);
      expect(createCalls.length).toBe(1);
    });

    it("should handle database errors gracefully", async () => {
      const dbError = new Error("Database connection failed");
      mockGroupRepository.findUserGroup.mockRejectedValue(dbError);

      await expect(groupUsecase.createGroupForUser("user-1")).rejects.toThrow(
        "Database connection failed"
      );

      expect(mockGroupRepository.findUserGroup).toHaveBeenCalledWith("user-1");
      expect(mockGroupRepository.createGroupForUser).not.toHaveBeenCalled();
      expect(mockGroupRepository.removeUserFromGroup).not.toHaveBeenCalled();
    });

    it("should handle create group repository failure", async () => {
      const createError = new Error("Failed to create group");
      mockGroupRepository.findUserGroup.mockResolvedValue(null);
      mockGroupRepository.createGroupForUser.mockRejectedValue(createError);

      await expect(groupUsecase.createGroupForUser("user-1")).rejects.toThrow(
        "Failed to create group"
      );

      expect(mockGroupRepository.findUserGroup).toHaveBeenCalledWith("user-1");
      expect(mockGroupRepository.createGroupForUser).toHaveBeenCalledWith(
        "user-1"
      );
      expect(mockGroupRepository.removeUserFromGroup).not.toHaveBeenCalled();
    });
  });

  describe("joinGroup", () => {
    it("should allow user to join group with valid invite code", async () => {
      const targetGroup = {
        id: "group-1",
        ownerId: "user-2",
        inviteCode: "ABC123",
        memberCount: 2,
        isConfirmed: false,
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      (InviteCodeGenerator.isValidFormat as jest.Mock).mockReturnValue(true);
      mockGroupRepository.findGroupByInviteCode.mockResolvedValue(targetGroup);
      mockGroupRepository.findUserGroup.mockResolvedValue(null);
      mockGroupRepository.addUserToGroup.mockResolvedValue();

      await groupUsecase.joinGroup("user-1", "ABC123");

      expect(InviteCodeGenerator.isValidFormat).toHaveBeenCalledWith("ABC123");
      expect(mockGroupRepository.findGroupByInviteCode).toHaveBeenCalledWith(
        "ABC123"
      );
      expect(mockGroupRepository.findUserGroup).toHaveBeenCalledWith("user-1");
      expect(mockGroupRepository.addUserToGroup).toHaveBeenCalledWith(
        "user-1",
        "group-1"
      );

      // Verify validation checks were called
      expect(InviteCodeGenerator.isValidFormat).toHaveBeenCalledTimes(1);
      expect(mockGroupRepository.findGroupByInviteCode).toHaveBeenCalledTimes(
        1
      );
      expect(mockGroupRepository.findUserGroup).toHaveBeenCalledTimes(1);
    });

    it("should throw error for invalid invite code format", async () => {
      (InviteCodeGenerator.isValidFormat as jest.Mock).mockReturnValue(false);

      await expect(groupUsecase.joinGroup("user-1", "invalid")).rejects.toThrow(
        "Invalid invite code format"
      );

      expect(InviteCodeGenerator.isValidFormat).toHaveBeenCalledWith("invalid");
      expect(mockGroupRepository.findGroupByInviteCode).not.toHaveBeenCalled();
      expect(mockGroupRepository.addUserToGroup).not.toHaveBeenCalled();
    });

    it("should throw error if invite code doesn't exist", async () => {
      (InviteCodeGenerator.isValidFormat as jest.Mock).mockReturnValue(true);
      mockGroupRepository.findGroupByInviteCode.mockResolvedValue(null);

      await expect(groupUsecase.joinGroup("user-1", "ABC123")).rejects.toThrow(
        "Invalid invite code"
      );

      expect(InviteCodeGenerator.isValidFormat).toHaveBeenCalledWith("ABC123");
      expect(mockGroupRepository.findGroupByInviteCode).toHaveBeenCalledWith(
        "ABC123"
      );
      expect(mockGroupRepository.findUserGroup).not.toHaveBeenCalled();
      expect(mockGroupRepository.addUserToGroup).not.toHaveBeenCalled();
    });

    it("should throw error if group is confirmed", async () => {
      const targetGroup = {
        id: "group-1",
        ownerId: "user-2",
        inviteCode: "ABC123",
        memberCount: 2,
        isConfirmed: true, // Confirmed group
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      (InviteCodeGenerator.isValidFormat as jest.Mock).mockReturnValue(true);
      mockGroupRepository.findGroupByInviteCode.mockResolvedValue(targetGroup);

      await expect(groupUsecase.joinGroup("user-1", "ABC123")).rejects.toThrow(
        "Cannot join a confirmed group"
      );

      expect(InviteCodeGenerator.isValidFormat).toHaveBeenCalledWith("ABC123");
      expect(mockGroupRepository.findGroupByInviteCode).toHaveBeenCalledWith(
        "ABC123"
      );
      expect(mockGroupRepository.findUserGroup).not.toHaveBeenCalled();
      expect(mockGroupRepository.addUserToGroup).not.toHaveBeenCalled();
    });

    it("should throw error if group is at capacity", async () => {
      const targetGroup = {
        id: "group-1",
        ownerId: "user-2",
        inviteCode: "ABC123",
        memberCount: 3, // At capacity
        isConfirmed: false,
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      (InviteCodeGenerator.isValidFormat as jest.Mock).mockReturnValue(true);
      mockGroupRepository.findGroupByInviteCode.mockResolvedValue(targetGroup);

      await expect(groupUsecase.joinGroup("user-1", "ABC123")).rejects.toThrow(
        "Group is at maximum capacity (3 members)"
      );
    });

    it("should throw error if user is already in a group", async () => {
      const targetGroup = {
        id: "group-1",
        ownerId: "user-2",
        inviteCode: "ABC123",
        memberCount: 2,
        isConfirmed: false,
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      const currentGroup = {
        id: "group-2",
        ownerId: "user-3",
      };

      (InviteCodeGenerator.isValidFormat as jest.Mock).mockReturnValue(true);
      mockGroupRepository.findGroupByInviteCode.mockResolvedValue(targetGroup);
      mockGroupRepository.findUserGroup.mockResolvedValue(currentGroup as any);

      await expect(groupUsecase.joinGroup("user-1", "ABC123")).rejects.toThrow(
        "User is already in a group. Leave current group first."
      );
    });

    it("should throw error if user tries to join their own group", async () => {
      const targetGroup = {
        id: "group-1",
        ownerId: "user-1", // Same as the user trying to join
        inviteCode: "ABC123",
        memberCount: 1,
        isConfirmed: false,
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      (InviteCodeGenerator.isValidFormat as jest.Mock).mockReturnValue(true);
      mockGroupRepository.findGroupByInviteCode.mockResolvedValue(targetGroup);
      mockGroupRepository.findUserGroup.mockResolvedValue(null);

      await expect(groupUsecase.joinGroup("user-1", "ABC123")).rejects.toThrow(
        "Cannot join your own group"
      );
    });
  });

  describe("leaveGroup", () => {
    it("should allow member to leave group", async () => {
      const currentGroup = {
        id: "group-1",
        ownerId: "user-2", // User is not the owner
        isConfirmed: false,
        users: [{ id: "user-1" }, { id: "user-2" }],
        owner: {},
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      mockGroupRepository.findUserGroup.mockResolvedValue(currentGroup as any);

      // Mock prisma transaction
      const { prisma } = require("@/lib/prisma");
      prisma.$transaction.mockImplementation((callback: any) => callback({}));

      await groupUsecase.leaveGroup("user-1");

      expect(mockGroupRepository.findUserGroup).toHaveBeenCalledWith("user-1");
    });

    it("should throw error if user is not in any group", async () => {
      mockGroupRepository.findUserGroup.mockResolvedValue(null);

      await expect(groupUsecase.leaveGroup("user-1")).rejects.toThrow(
        "User is not in any group"
      );
    });

    it("should throw error if group is confirmed", async () => {
      const currentGroup = {
        id: "group-1",
        ownerId: "user-2",
        isConfirmed: true, // Confirmed group
        users: [],
        owner: {},
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      mockGroupRepository.findUserGroup.mockResolvedValue(currentGroup as any);

      await expect(groupUsecase.leaveGroup("user-1")).rejects.toThrow(
        "Cannot leave a confirmed group"
      );
    });

    it("should throw error if owner tries to leave", async () => {
      const currentGroup = {
        id: "group-1",
        ownerId: "user-1", // User is the owner
        isConfirmed: false,
        users: [],
        owner: {},
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      mockGroupRepository.findUserGroup.mockResolvedValue(currentGroup as any);

      await expect(groupUsecase.leaveGroup("user-1")).rejects.toThrow(
        "Group owner cannot leave their own group"
      );
    });
  });

  describe("kickMember", () => {
    it("should allow owner to kick member", async () => {
      const ownerGroup = {
        id: "group-1",
        ownerId: "user-1",
        isConfirmed: false,
        users: [{ id: "user-1" }, { id: "user-2" }],
        owner: {},
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      mockGroupRepository.findUserGroup.mockResolvedValue(ownerGroup as any);

      // Mock prisma transaction
      const { prisma } = require("@/lib/prisma");
      prisma.$transaction.mockImplementation((callback: any) => callback({}));

      await groupUsecase.kickMember("user-1", "user-2");

      expect(mockGroupRepository.findUserGroup).toHaveBeenCalledWith("user-1");
    });

    it("should throw error if user is not group owner", async () => {
      const ownerGroup = {
        id: "group-1",
        ownerId: "user-2", // Different owner
        isConfirmed: false,
        users: [],
        owner: {},
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      mockGroupRepository.findUserGroup.mockResolvedValue(ownerGroup as any);

      await expect(groupUsecase.kickMember("user-1", "user-3")).rejects.toThrow(
        "Only group owner can kick members"
      );
    });

    it("should throw error if group is confirmed", async () => {
      const ownerGroup = {
        id: "group-1",
        ownerId: "user-1",
        isConfirmed: true, // Confirmed group
        users: [],
        owner: {},
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      mockGroupRepository.findUserGroup.mockResolvedValue(ownerGroup as any);

      await expect(groupUsecase.kickMember("user-1", "user-2")).rejects.toThrow(
        "Cannot kick members from a confirmed group"
      );
    });

    it("should throw error if member is not in group", async () => {
      const ownerGroup = {
        id: "group-1",
        ownerId: "user-1",
        isConfirmed: false,
        users: [{ id: "user-1" }], // user-2 not in group
        owner: {},
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      mockGroupRepository.findUserGroup.mockResolvedValue(ownerGroup as any);

      await expect(groupUsecase.kickMember("user-1", "user-2")).rejects.toThrow(
        "User is not a member of this group"
      );
    });

    it("should throw error if trying to kick the owner", async () => {
      const ownerGroup = {
        id: "group-1",
        ownerId: "user-1",
        isConfirmed: false,
        users: [{ id: "user-1" }, { id: "user-2" }],
        owner: {},
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      mockGroupRepository.findUserGroup.mockResolvedValue(ownerGroup as any);

      await expect(groupUsecase.kickMember("user-1", "user-1")).rejects.toThrow(
        "Cannot kick the group owner"
      );
    });
  });

  describe("confirmGroup", () => {
    it("should allow owner to confirm group", async () => {
      const userGroup = {
        id: "group-1",
        ownerId: "user-1",
        isConfirmed: false,
        owner: {},
        users: [],
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      const confirmedGroup = { ...userGroup, isConfirmed: true };

      mockGroupRepository.findUserGroup.mockResolvedValue(userGroup as any);
      mockGroupRepository.confirmGroup.mockResolvedValue(confirmedGroup as any);

      const result = await groupUsecase.confirmGroup("user-1");

      expect(result).toEqual(confirmedGroup);
      expect(mockGroupRepository.confirmGroup).toHaveBeenCalledWith("group-1");
    });

    it("should throw error if user is not group owner", async () => {
      const userGroup = {
        id: "group-1",
        ownerId: "user-2", // Different owner
        isConfirmed: false,
        owner: {},
        users: [],
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      mockGroupRepository.findUserGroup.mockResolvedValue(userGroup as any);

      await expect(groupUsecase.confirmGroup("user-1")).rejects.toThrow(
        "Only group owner can confirm the group"
      );
    });

    it("should throw error if group is already confirmed", async () => {
      const userGroup = {
        id: "group-1",
        ownerId: "user-1",
        isConfirmed: true, // Already confirmed
        owner: {},
        users: [],
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      mockGroupRepository.findUserGroup.mockResolvedValue(userGroup as any);

      await expect(groupUsecase.confirmGroup("user-1")).rejects.toThrow(
        "Group is already confirmed"
      );
    });
  });
});
