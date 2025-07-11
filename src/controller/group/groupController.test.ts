import { Response } from "express";
import { GroupController } from "./groupController";
import { GroupUsecase } from "@/usecase/group/groupUsecase";
import type { AuthenticatedRequest } from "@/types/auth/authenticatedRequest";

// Mock GroupUsecase
jest.mock("@/usecase/group/groupUsecase");

// Mock UUIDValidator
jest.mock("@/utils/uuidValidator", () => ({
  UUIDValidator: {
    validate: jest.fn(),
    isValid: jest.fn().mockReturnValue(true),
  },
}));

describe("GroupController", () => {
  let groupController: GroupController;
  let mockGroupUsecase: jest.Mocked<GroupUsecase>;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    groupController = new GroupController();
    mockGroupUsecase = new GroupUsecase() as jest.Mocked<GroupUsecase>;

    // Mock the usecase in the controller
    (groupController as any).groupUsecase = mockGroupUsecase;

    mockRequest = {
      user: { id: "user-1", studentId: "123456", citizenId: "1234567890123" },
      body: {},
      headers: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe("getGroup", () => {
    it("should return group data when user has a group", async () => {
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
      } as any;

      mockGroupUsecase.getUserGroup.mockResolvedValue(mockGroup);

      await groupController.getGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockGroupUsecase.getUserGroup).toHaveBeenCalledWith("user-1");
      expect(mockGroupUsecase.getUserGroup).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Group retrieved successfully",
        data: mockGroup,
        timestamp: expect.any(String),
      });
      expect(mockResponse.json).toHaveBeenCalledTimes(1);

      // Verify timestamp is valid ISO string
      const mockJsonCalls = (mockResponse.json as jest.Mock).mock.calls;
      expect(mockJsonCalls).toHaveLength(1);
      const responseData = mockJsonCalls[0][0];
      expect(responseData.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });

    it("should return 404 when user has no group", async () => {
      mockGroupUsecase.getUserGroup.mockResolvedValue(null);

      await groupController.getGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockGroupUsecase.getUserGroup).toHaveBeenCalledWith("user-1");
      expect(mockGroupUsecase.getUserGroup).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: "User is not in any group",
        timestamp: expect.any(String),
      });
      expect(mockResponse.json).toHaveBeenCalledTimes(1);

      // Verify timestamp is valid ISO string
      const mockJsonCalls = (mockResponse.json as jest.Mock).mock.calls;
      expect(mockJsonCalls).toHaveLength(1);
      const responseData = mockJsonCalls[0][0];
      expect(responseData.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
    });

    it("should return 401 when user is not authenticated", async () => {
      mockRequest.user = undefined;

      await groupController.getGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: "User not authenticated",
        timestamp: expect.any(String),
      });
    });

    it("should return 500 on internal error", async () => {
      mockGroupUsecase.getUserGroup.mockRejectedValue(
        new Error("Database error")
      );

      await groupController.getGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: "Internal server error",
        timestamp: expect.any(String),
      });
    });
  });

  describe("createGroup", () => {
    it("should create group successfully", async () => {
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

      mockGroupUsecase.createGroup.mockResolvedValue(mockGroup);

      await groupController.createGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockGroupUsecase.createGroup).toHaveBeenCalledWith("user-1");
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Group created successfully",
        data: {
          id: "group-1",
          ownerId: "user-1",
          inviteCode: "ABC123",
          memberCount: 1,
          isConfirmed: false,
        },
        timestamp: expect.any(String),
      });
    });

    it("should return 400 on business logic error", async () => {
      mockGroupUsecase.createGroup.mockRejectedValue(
        new Error("User already owns a group")
      );

      await groupController.createGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: "User already owns a group",
        timestamp: expect.any(String),
      });
    });
  });

  describe("joinGroup", () => {
    it("should join group successfully", async () => {
      mockRequest.body = { inviteCode: "ABC123" };
      mockGroupUsecase.joinGroup.mockResolvedValue();

      await groupController.joinGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockGroupUsecase.joinGroup).toHaveBeenCalledWith(
        "user-1",
        "ABC123"
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Joined group successfully",
        data: {
          message: "You have successfully joined the group",
        },
        timestamp: expect.any(String),
      });
    });

    it("should return 400 when invite code is missing", async () => {
      mockRequest.body = {};

      await groupController.joinGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: "Invite code is required",
        timestamp: expect.any(String),
      });
    });

    it("should return 400 on invalid invite code", async () => {
      mockRequest.body = { inviteCode: "INVALID" };
      mockGroupUsecase.joinGroup.mockRejectedValue(
        new Error("Invalid invite code")
      );

      await groupController.joinGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: "Invalid invite code",
        timestamp: expect.any(String),
      });
    });
  });

  describe("kickMember", () => {
    it("should kick member successfully", async () => {
      mockRequest.body = { userId: "user-2" };
      mockGroupUsecase.kickMember.mockResolvedValue();

      await groupController.kickMember(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockGroupUsecase.kickMember).toHaveBeenCalledWith(
        "user-1",
        "user-2"
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Member kicked successfully and new group created for them",
        data: {
          kickedUserId: "user-2",
          message: "Member has been removed and given their own group",
        },
        timestamp: expect.any(String),
      });
    });

    it("should return 400 when userId is missing", async () => {
      mockRequest.body = {};

      await groupController.kickMember(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: "Member user ID is required",
        timestamp: expect.any(String),
      });
    });
  });

  describe("confirmGroup", () => {
    it("should confirm group successfully", async () => {
      const mockGroup = {
        id: "group-1",
        isConfirmed: true,
      };

      mockGroupUsecase.confirmGroup.mockResolvedValue(mockGroup as any);

      await groupController.confirmGroup(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockGroupUsecase.confirmGroup).toHaveBeenCalledWith("user-1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Group confirmed successfully",
        data: {
          groupId: "group-1",
          isConfirmed: true,
          message: "Group is now locked and no changes are allowed",
        },
        timestamp: expect.any(String),
      });
    });
  });

  describe("setHousePreferences", () => {
    it("should set house preferences successfully", async () => {
      const preferences = {
        houseRank1: "house-1",
        houseRank2: "house-2",
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: "house-3",
      };

      const updatedGroup = {
        id: "group-1",
        ...preferences,
      };

      mockRequest.body = preferences;
      mockGroupUsecase.setHousePreferences.mockResolvedValue(
        updatedGroup as any
      );

      await groupController.setHousePreferences(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockGroupUsecase.setHousePreferences).toHaveBeenCalledWith(
        "user-1",
        preferences
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "House preferences updated successfully",
        data: {
          groupId: "group-1",
          updatedPreferences: preferences,
          message:
            "House preferences have been updated and chosen counts adjusted",
        },
        timestamp: expect.any(String),
      });
    });
  });

  describe("getAllHouses", () => {
    it("should return all houses successfully", async () => {
      const mockHouses = [
        {
          id: "house-1",
          nameThai: "บ้านแดง",
          nameEnglish: "Red House",
          chosenCount: 5,
          capacity: 100,
        },
        {
          id: "house-2",
          nameThai: "บ้านฟ้า",
          nameEnglish: "Blue House",
          chosenCount: 3,
          capacity: 100,
        },
      ];

      mockGroupUsecase.getAllHouses.mockResolvedValue(mockHouses as any);

      await groupController.getAllHouses(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response
      );

      expect(mockGroupUsecase.getAllHouses).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Houses retrieved successfully",
        data: mockHouses,
        timestamp: expect.any(String),
      });
    });
  });
});
