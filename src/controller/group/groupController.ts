import { Response } from "express";

import { AuthenticatedRequest } from "@/types/auth/authenticatedRequest";
import {
  JoinGroupRequest,
  KickMemberRequest,
  SetHousePreferencesRequest,
} from "@/types/group/POST";
import { GroupUsecase } from "@/usecase/group/groupUsecase";
import { UUIDValidator } from "@/utils/uuidValidator";

import { AppError } from "../../types/error/AppError";

export class GroupController {
  private groupUsecase: GroupUsecase;

  constructor() {
    this.groupUsecase = new GroupUsecase();
  }

  async getGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const group = await this.groupUsecase.getUserGroup(userId);
      if (!group) {
        res.status(404).json({
          success: false,
          error: "User is not in any group",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Group retrieved successfully",
        data: group,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Get group error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  }
  async getGroupByInviteCode(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
          timestamp: new Date().toISOString(),
        });
        return;
      }
      const inviteCode = req.body.inviteCode;
      if (!inviteCode) {
        res.status(400).json({
          success: false,
          error: "Invite code is required",
          timestamp: new Date().toISOString(),
        });
        return;
      }
      
      const group = await this.groupUsecase.getGroupByInviteCode(inviteCode);
      if (!group) {
        res.status(404).json({
          success: false,
          error: "Group not found with the provided invite code",
          timestamp: new Date().toISOString(),
        });
        return ;
      }

      res.status(200).json({
        success: true,
        message: "Group retrieved successfully",
        data: group,
        timestamp: new Date().toISOString(),
      });
    } catch (error: unknown) {
          if (error instanceof AppError) {
            res.status(error.statusCode).json({
              message: error.message,
            });
            return;
          }
          console.error("Error creating check-in by user ID:", error);
          res.status(500).json({
            message: "An unexpected error occurred",
          });
        }
  }

  async createGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const group = await this.groupUsecase.createGroup(userId);

      res.status(201).json({
        success: true,
        message: "Group created successfully",
        data: {
          id: group.id,
          ownerId: group.ownerId,
          inviteCode: group.inviteCode,
          memberCount: group.memberCount,
          isConfirmed: group.isConfirmed,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Create group error:", error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  }

  async leaveGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await this.groupUsecase.leaveGroup(userId);

      res.status(200).json({
        success: true,
        message: "Left group successfully and created new group",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Leave group error:", error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  }

  async kickMember(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { userId: memberUserId }: KickMemberRequest = req.body;
      if (!memberUserId) {
        res.status(400).json({
          success: false,
          error: "Member user ID is required",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      try {
        UUIDValidator.validate(memberUserId, "Member user ID");
      } catch (error) {
        res.status(400).json({
          success: false,
          error:
            error instanceof Error ? error.message : "Invalid member user ID",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await this.groupUsecase.kickMember(userId, memberUserId);

      res.status(200).json({
        success: true,
        message: "Member kicked successfully and new group created for them",
        data: {
          kickedUserId: memberUserId,
          message: "Member has been removed and given their own group",
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Kick member error:", error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  }

  async confirmGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const group = await this.groupUsecase.confirmGroup(userId);

      res.status(200).json({
        success: true,
        message: "Group confirmed successfully",
        data: {
          groupId: group.id,
          isConfirmed: group.isConfirmed,
          message: "Group is now locked and no changes are allowed",
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Confirm group error:", error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  }

  async regenerateInviteCode(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const newInviteCode = await this.groupUsecase.regenerateInviteCode(
        userId
      );

      res.status(200).json({
        success: true,
        message: "Invite code regenerated successfully",
        data: {
          newInviteCode,
          message: "New invite code has been generated",
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Regenerate invite code error:", error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  }

  async joinGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const { inviteCode }: JoinGroupRequest = req.body;
      if (!inviteCode) {
        res.status(400).json({
          success: false,
          error: "Invite code is required",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      await this.groupUsecase.joinGroup(userId, inviteCode);

      res.status(200).json({
        success: true,
        message: "Joined group successfully",
        data: {
          message: "You have successfully joined the group",
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Join group error:", error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getInviteCode(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const inviteCode = await this.groupUsecase.getInviteCode(userId);

      res.status(200).json({
        success: true,
        message: "Invite code retrieved successfully",
        data: { inviteCode },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Get invite code error:", error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  }

  async setHousePreferences(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const preferences: SetHousePreferencesRequest = req.body;

      const houseIds = [
        preferences.houseRank1,
        preferences.houseRank2,
        preferences.houseRank3,
        preferences.houseRank4,
        preferences.houseRank5,
        preferences.houseRankSub,
      ].filter((id) => id !== null && id !== undefined);

      try {
        for (const houseId of houseIds) {
          if (houseId) {
            UUIDValidator.validate(houseId, "House ID");
          }
        }
      } catch (error) {
        res.status(400).json({
          success: false,
          error:
            error instanceof Error ? error.message : "Invalid house ID format",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const updatedGroup = await this.groupUsecase.setHousePreferences(
        userId,
        preferences
      );

      res.status(200).json({
        success: true,
        message: "House preferences updated successfully",
        data: {
          groupId: updatedGroup.id,
          updatedPreferences: {
            houseRank1: updatedGroup.houseRank1,
            houseRank2: updatedGroup.houseRank2,
            houseRank3: updatedGroup.houseRank3,
            houseRank4: updatedGroup.houseRank4,
            houseRank5: updatedGroup.houseRank5,
            houseRankSub: updatedGroup.houseRankSub,
          },
          message:
            "House preferences have been updated and chosen counts adjusted",
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Set house preferences error:", error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getHousePreferences(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const preferences = await this.groupUsecase.getHousePreferences(userId);

      res.status(200).json({
        success: true,
        message: "House preferences retrieved successfully",
        data: preferences,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Get house preferences error:", error);

      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  }

  async getAllHouses(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const houses = await this.groupUsecase.getAllHouses();

      res.status(200).json({
        success: true,
        message: "Houses retrieved successfully",
        data: houses,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Get all houses error:", error);

      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      });
    }
  }
}
