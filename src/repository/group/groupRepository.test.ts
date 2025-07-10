import { InviteCodeGenerator } from "@/utils/inviteCodeGenerator";

import { GroupRepository } from "./groupRepository";

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  prisma: {
    group: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

import { prisma } from "@/lib/prisma";
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Mock InviteCodeGenerator
jest.mock("@/utils/inviteCodeGenerator");

describe("GroupRepository", () => {
  let groupRepository: GroupRepository;

  beforeEach(() => {
    groupRepository = new GroupRepository();
    jest.clearAllMocks();
  });

  describe("findGroupById", () => {
    it("should find group by ID with related data", async () => {
      const mockGroup = {
        id: "group-1",
        ownerId: "user-1",
        inviteCode: "ABC123",
        memberCount: 2,
        isConfirmed: false,
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
        owner: { id: "user-1", studentId: "123456" },
        users: [{ id: "user-1" }, { id: "user-2" }],
        house1: null,
        house2: null,
        house3: null,
        house4: null,
        house5: null,
        houseSub: null,
      };

      (mockPrisma.group.findUnique as jest.Mock).mockResolvedValue(mockGroup);

      const result = await groupRepository.findGroupById("group-1");

      expect(result).toEqual(mockGroup);
      expect(mockPrisma.group.findUnique).toHaveBeenCalledWith({
        where: { id: "group-1" },
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
    });

    it("should return null if group not found", async () => {
      (mockPrisma.group.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await groupRepository.findGroupById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("findGroupByInviteCode", () => {
    it("should find group by invite code", async () => {
      const mockGroup = {
        id: "group-1",
        inviteCode: "ABC123",
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      (InviteCodeGenerator.normalize as jest.Mock).mockReturnValue("ABC123");
      (mockPrisma.group.findUnique as jest.Mock).mockResolvedValue(mockGroup);

      const result = await groupRepository.findGroupByInviteCode("abc123");

      expect(result).toEqual(mockGroup);
      expect(InviteCodeGenerator.normalize).toHaveBeenCalledWith("abc123");
      expect(mockPrisma.group.findUnique).toHaveBeenCalledWith({
        where: { inviteCode: "ABC123" },
      });
    });
  });

  describe("createGroupForUser", () => {
    it("should create group for user with transaction", async () => {
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

      const mockTx = {
        group: { create: jest.fn().mockResolvedValue(mockGroup) },
        user: { update: jest.fn() },
      } as any;

      (InviteCodeGenerator.generate as jest.Mock).mockResolvedValue("ABC123");
      (mockPrisma.$transaction as jest.Mock).mockImplementation(
        (callback: any) => callback(mockTx)
      );

      const result = await groupRepository.createGroupForUser("user-1");

      expect(result).toEqual(mockGroup);
      expect(InviteCodeGenerator.generate).toHaveBeenCalled();
      expect(mockTx.group.create).toHaveBeenCalledWith({
        data: {
          ownerId: "user-1",
          inviteCode: "ABC123",
          memberCount: 1,
          isConfirmed: false,
        },
      });
      expect(mockTx.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { groupId: "group-1" },
      });
    });
  });

  describe("addUserToGroup", () => {
    it("should add user to group with transaction", async () => {
      const mockTx = {
        user: { update: jest.fn() },
        group: { update: jest.fn() },
      } as any;

      (mockPrisma.$transaction as jest.Mock).mockImplementation(
        (callback: any) => callback(mockTx)
      );

      await groupRepository.addUserToGroup("user-1", "group-1");

      expect(mockTx.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { groupId: "group-1" },
      });
      expect(mockTx.group.update).toHaveBeenCalledWith({
        where: { id: "group-1" },
        data: { memberCount: { increment: 1 } },
      });
    });
  });

  describe("removeUserFromGroup", () => {
    it("should remove user from group with transaction", async () => {
      const mockTx = {
        user: { update: jest.fn() },
        group: { update: jest.fn() },
      } as any;

      (mockPrisma.$transaction as jest.Mock).mockImplementation(
        (callback: any) => callback(mockTx)
      );

      await groupRepository.removeUserFromGroup("user-1", "group-1");

      expect(mockTx.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { groupId: null },
      });
      expect(mockTx.group.update).toHaveBeenCalledWith({
        where: { id: "group-1" },
        data: { memberCount: { decrement: 1 } },
      });
    });
  });

  describe("confirmGroup", () => {
    it("should confirm group", async () => {
      const mockGroup = {
        id: "group-1",
        isConfirmed: true,
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      (mockPrisma.group.update as jest.Mock).mockResolvedValue(mockGroup);

      const result = await groupRepository.confirmGroup("group-1");

      expect(result).toEqual(mockGroup);
      expect(mockPrisma.group.update).toHaveBeenCalledWith({
        where: { id: "group-1" },
        data: { isConfirmed: true },
      });
    });

    it("should handle group update failure", async () => {
      (mockPrisma.group.update as jest.Mock).mockResolvedValue({});

      const result = await groupRepository.confirmGroup("group-1");

      expect(result).toEqual({});
    });
  });

  describe("isGroupOwner", () => {
    it("should return true if user is owner", async () => {
      (mockPrisma.group.findUnique as jest.Mock).mockResolvedValue({
        ownerId: "user-1",
      });

      const result = await groupRepository.isGroupOwner("user-1", "group-1");

      expect(result).toBe(true);
    });

    it("should return false if user is not owner", async () => {
      (mockPrisma.group.findUnique as jest.Mock).mockResolvedValue({
        ownerId: "user-2",
      });

      const result = await groupRepository.isGroupOwner("user-1", "group-1");

      expect(result).toBe(false);
    });

    it("should return false if group not found", async () => {
      (mockPrisma.group.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await groupRepository.isGroupOwner("user-1", "group-1");

      expect(result).toBe(false);
    });
  });
});
