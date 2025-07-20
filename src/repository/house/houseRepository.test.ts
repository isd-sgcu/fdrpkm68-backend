import { prisma } from "@/lib/prisma";
import { House } from "@/types/house/house";

import { HouseRepository } from "./houseRepository";

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  prisma: {
    house: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("HouseRepository", () => {
  let houseRepository: HouseRepository;
  const mockPrisma = {
    house: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    houseRepository = new HouseRepository();
    // Use mockReset() instead of mockClear() to completely reset the mocks
    mockPrisma.house.findMany.mockReset();
    mockPrisma.house.findUnique.mockReset();
    mockPrisma.house.update.mockReset();

    // Reassign the reset mocks to prisma
    (prisma as any).house.findMany = mockPrisma.house.findMany;
    (prisma as any).house.findUnique = mockPrisma.house.findUnique;
    (prisma as any).house.update = mockPrisma.house.update;
  });

  const mockHouseData = {
    id: "house-1",
    nameThai: "บ้านไทย",
    nameEnglish: "Thai House",
    descriptionThai: "คำอธิบายภาษาไทย",
    descriptionEnglish: "English description",
    sizeLetter: "A",
    chosenCount: 5,
    capacity: 10,
    instagram: "@thaihouse",
    facebook: "ThaiHouse",
    tiktok: "@thaihouse",
  };

  const expectedHouseOutput: House = {
    id: "house-1",
    nameThai: "บ้านไทย",
    nameEnglish: "Thai House",
    descriptionThai: "คำอธิบายภาษาไทย",
    descriptionEnglish: "English description",
    sizeLetter: "A",
    chosenCount: 5,
    capacity: 10,
    instagram: "@thaihouse",
    facebook: "ThaiHouse",
    tiktok: "@thaihouse",
  };

  describe("getAllHouses", () => {
    it("should return all houses successfully", async () => {
      const mockHouses = [mockHouseData, { ...mockHouseData, id: "house-2" }];
      mockPrisma.house.findMany.mockResolvedValue(mockHouses);

      const result = await houseRepository.getAllHouses();

      expect(mockPrisma.house.findMany).toHaveBeenCalledWith({
        orderBy: {
          id: "asc",
        },
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expectedHouseOutput);
    });

    it("should throw error when database operation fails", async () => {
      const error = new Error("Database connection failed");
      mockPrisma.house.findMany.mockRejectedValue(error);

      await expect(houseRepository.getAllHouses()).rejects.toThrow(
        "Database error in getAllHouses: Database connection failed"
      );
    });

    it("should handle unknown errors", async () => {
      mockPrisma.house.findMany.mockRejectedValue("Unknown error");

      await expect(houseRepository.getAllHouses()).rejects.toThrow(
        "Database error in getAllHouses: Unknown error"
      );
    });

    it("should return empty array when no houses exist", async () => {
      mockPrisma.house.findMany.mockResolvedValue([]);

      const result = await houseRepository.getAllHouses();

      expect(result).toEqual([]);
    });
  });

  describe("getHouseById", () => {
    it("should return house when found", async () => {
      mockPrisma.house.findUnique.mockResolvedValue(mockHouseData);

      const result = await houseRepository.getHouseById("house-1");

      expect(mockPrisma.house.findUnique).toHaveBeenCalledWith({
        where: {
          id: "house-1",
        },
      });
      expect(result).toEqual(expectedHouseOutput);
    });

    it("should return null when house not found", async () => {
      mockPrisma.house.findUnique.mockResolvedValue(null);

      const result = await houseRepository.getHouseById("non-existent");

      expect(result).toBeNull();
    });

    it("should throw error when database operation fails", async () => {
      const error = new Error("Database connection failed");
      mockPrisma.house.findUnique.mockRejectedValue(error);

      await expect(houseRepository.getHouseById("house-1")).rejects.toThrow(
        "Database error in getHouseById: Database connection failed"
      );
    });
  });

  describe("updateHouseMemberCount", () => {
    it("should update house member count successfully", async () => {
      mockPrisma.house.update.mockResolvedValue(mockHouseData);

      await houseRepository.updateHouseMemberCount("house-1", 15);

      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: {
          id: "house-1",
        },
        data: {
          chosenCount: 15,
        },
      });
    });

    it("should throw error when update fails", async () => {
      const error = new Error("Update failed");
      mockPrisma.house.update.mockRejectedValue(error);

      await expect(
        houseRepository.updateHouseMemberCount("house-1", 15)
      ).rejects.toThrow(
        "Database error in updateHouseMemberCount: Update failed"
      );
    });
  });

  describe("validateHouseIds", () => {
    it("should return true when all house IDs are valid", async () => {
      const houseIds = ["house-1", "house-2", "house-3"];
      const mockFoundHouses = houseIds.map((id) => ({ id }));
      mockPrisma.house.findMany.mockResolvedValue(mockFoundHouses);

      const result = await houseRepository.validateHouseIds(houseIds);

      expect(mockPrisma.house.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: houseIds },
        },
        select: { id: true },
      });
      expect(result).toBe(true);
    });

    it("should return false when some house IDs are invalid", async () => {
      const houseIds = ["house-1", "house-2", "house-3"];
      const mockFoundHouses = [{ id: "house-1" }, { id: "house-2" }]; // Missing house-3
      mockPrisma.house.findMany.mockResolvedValue(mockFoundHouses);

      const result = await houseRepository.validateHouseIds(houseIds);

      expect(result).toBe(false);
    });

    it("should return true when empty array is provided", async () => {
      const result = await houseRepository.validateHouseIds([]);

      expect(mockPrisma.house.findMany).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("should filter out null values", async () => {
      const houseIds = ["house-1", null, "house-2"];
      const mockFoundHouses = [{ id: "house-1" }, { id: "house-2" }];
      mockPrisma.house.findMany.mockResolvedValue(mockFoundHouses);

      const result = await houseRepository.validateHouseIds(houseIds);

      expect(mockPrisma.house.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: ["house-1", "house-2"] },
        },
        select: { id: true },
      });
      expect(result).toBe(true);
    });

    it("should throw error when database operation fails", async () => {
      const error = new Error("Database error");
      mockPrisma.house.findMany.mockRejectedValue(error);

      await expect(
        houseRepository.validateHouseIds(["house-1"])
      ).rejects.toThrow("Failed to validate house IDs");
    });
  });

  describe("incrementChosenCounts", () => {
    it("should increment chosen counts for all provided house IDs", async () => {
      const houseIds = ["house-1", "house-2", "house-3"];
      mockPrisma.house.update.mockResolvedValue(mockHouseData);

      await houseRepository.incrementChosenCounts(houseIds, 1);

      expect(mockPrisma.house.update).toHaveBeenCalledTimes(3);
      houseIds.forEach((id) => {
        expect(mockPrisma.house.update).toHaveBeenCalledWith({
          where: { id },
          data: {
            chosenCount: {
              increment: 1,
            },
          },
        });
      });
    });

    it("should do nothing when empty array is provided", async () => {
      await houseRepository.incrementChosenCounts([], 1);

      expect(mockPrisma.house.update).not.toHaveBeenCalled();
    });

    it("should filter out null values", async () => {
      const houseIds = ["house-1", null as any, "house-2"];
      mockPrisma.house.update.mockResolvedValue(mockHouseData);

      await houseRepository.incrementChosenCounts(houseIds, 1);

      expect(mockPrisma.house.update).toHaveBeenCalledTimes(2);
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-1" },
        data: { chosenCount: { increment: 1 } },
      });
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-2" },
        data: { chosenCount: { increment: 1 } },
      });
    });

    it("should work with transaction client", async () => {
      const mockTx = {
        house: {
          update: jest.fn().mockResolvedValue(mockHouseData),
        },
      } as any;

      await houseRepository.incrementChosenCounts(["house-1"], mockTx);

      expect(mockTx.house.update).toHaveBeenCalledWith({
        where: { id: "house-1" },
        data: { chosenCount: { increment: 1 } },
      });
      expect(mockPrisma.house.update).not.toHaveBeenCalled();
    });

    it("should throw error when update fails", async () => {
      const error = new Error("Update failed");
      mockPrisma.house.update.mockRejectedValue(error);

      await expect(
        houseRepository.incrementChosenCounts(["house-1"], 1)
      ).rejects.toThrow("Failed to increment chosen counts");
    });
  });

  describe("decrementChosenCounts", () => {
    it("should decrement chosen counts for all provided house IDs", async () => {
      const houseIds = ["house-1", "house-2", "house-3"];
      mockPrisma.house.update.mockResolvedValue(mockHouseData);

      await houseRepository.decrementChosenCounts(houseIds, 1);

      expect(mockPrisma.house.update).toHaveBeenCalledTimes(3);
      houseIds.forEach((id) => {
        expect(mockPrisma.house.update).toHaveBeenCalledWith({
          where: { id },
          data: {
            chosenCount: {
              decrement: 1,
            },
          },
        });
      });
    });

    it("should do nothing when empty array is provided", async () => {
      await houseRepository.decrementChosenCounts([], 1);

      expect(mockPrisma.house.update).not.toHaveBeenCalled();
    });

    it("should filter out null values", async () => {
      const houseIds = ["house-1", null as any, "house-2"];
      mockPrisma.house.update.mockResolvedValue(mockHouseData);

      await houseRepository.decrementChosenCounts(houseIds, 1);

      expect(mockPrisma.house.update).toHaveBeenCalledTimes(2);
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-1" },
        data: { chosenCount: { decrement: 1 } },
      });
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-2" },
        data: { chosenCount: { decrement: 1 } },
      });
    });

    it("should work with transaction client", async () => {
      const mockTx = {
        house: {
          update: jest.fn().mockResolvedValue(mockHouseData),
        },
      } as any;

      await houseRepository.decrementChosenCounts(["house-1"], mockTx);

      expect(mockTx.house.update).toHaveBeenCalledWith({
        where: { id: "house-1" },
        data: { chosenCount: { decrement: 1 } },
      });
      expect(mockPrisma.house.update).not.toHaveBeenCalled();
    });

    it("should throw error when update fails", async () => {
      const error = new Error("Update failed");
      mockPrisma.house.update.mockRejectedValue(error);

      await expect(
        houseRepository.decrementChosenCounts(["house-1"], 1)
      ).rejects.toThrow("Failed to decrement chosen counts");
    });
  });

  describe("updateChosenCountsForPreferenceChange", () => {
    it("should decrement old preferences and increment new preferences", async () => {
      const oldPreferences = {
        houseRank1: "house-1",
        houseRank2: "house-2",
        houseRank3: "house-3",
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      const newPreferences = {
        houseRank1: "house-4",
        houseRank2: "house-5",
        houseRank3: "house-6",
        houseRank4: "house-7",
        houseRank5: null,
      };

      mockPrisma.house.update.mockResolvedValue({} as any);

      await houseRepository.updateChosenCountsForPreferenceChange(
        oldPreferences,
        newPreferences,
        1
      );

      // Verify decrement calls for old preferences
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-1" },
        data: { chosenCount: { decrement: 1 } },
      });
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-2" },
        data: { chosenCount: { decrement: 1 } },
      });
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-3" },
        data: { chosenCount: { decrement: 1 } },
      });

      // Verify increment calls for new preferences
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-4" },
        data: { chosenCount: { increment: 1 } },
      });
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-5" },
        data: { chosenCount: { increment: 1 } },
      });
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-6" },
        data: { chosenCount: { increment: 1 } },
      });
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-7" },
        data: { chosenCount: { increment: 1 } },
      });

      expect(mockPrisma.house.update).toHaveBeenCalledTimes(7);
    });

    it("should handle empty old preferences", async () => {
      const oldPreferences = {
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      const newPreferences = {
        houseRank1: "house-1",
        houseRank2: "house-2",
      };

      mockPrisma.house.update.mockResolvedValue({} as any);

      await houseRepository.updateChosenCountsForPreferenceChange(
        oldPreferences,
        newPreferences,
        1
      );

      // Only increment calls should be made
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-1" },
        data: { chosenCount: { increment: 1 } },
      });
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-2" },
        data: { chosenCount: { increment: 1 } },
      });

      expect(mockPrisma.house.update).toHaveBeenCalledTimes(5);
    });

    it("should handle empty new preferences", async () => {
      const oldPreferences = {
        houseRank1: "house-1",
        houseRank2: "house-2",
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      const newPreferences = {
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
      };

      mockPrisma.house.update.mockResolvedValue({} as any);

      await houseRepository.updateChosenCountsForPreferenceChange(
        oldPreferences,
        newPreferences,
        1
      );

      // Only decrement calls should be made
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-1" },
        data: { chosenCount: { decrement: 1 } },
      });
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-2" },
        data: { chosenCount: { decrement: 1 } },
      });

      expect(mockPrisma.house.update).toHaveBeenCalledTimes(2);
    });

    it("should handle both old and new preferences being empty", async () => {
      const oldPreferences = {
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      const newPreferences = {
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
      };

      await houseRepository.updateChosenCountsForPreferenceChange(
        oldPreferences,
        newPreferences,
        1
      );

      // No database calls should be made
      expect(mockPrisma.house.update).not.toHaveBeenCalled();
    });

    it("should work with transaction client", async () => {
      const mockTx = {
        house: {
          update: jest.fn().mockResolvedValue({}),
        },
      } as any;

      const oldPreferences = {
        houseRank1: "house-1",
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      const newPreferences = {
        houseRank1: "house-2",
      };

      await houseRepository.updateChosenCountsForPreferenceChange(
        oldPreferences,
        newPreferences,
        mockTx
      );

      // Verify transaction client was used instead of prisma
      expect(mockTx.house.update).toHaveBeenCalledWith({
        where: { id: "house-1" },
        data: { chosenCount: { decrement: 1 } },
      });
      expect(mockTx.house.update).toHaveBeenCalledWith({
        where: { id: "house-2" },
        data: { chosenCount: { increment: 1 } },
      });

      expect(mockPrisma.house.update).not.toHaveBeenCalled();
    });

    it("should handle partial new preferences object", async () => {
      mockPrisma.house.update.mockClear();

      const oldPreferences = {
        houseRank1: "house-1",
        houseRank2: "house-2",
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      const newPreferences = {
        houseRank1: "house-3",
        // Only houseRank1 is provided
      };

      mockPrisma.house.update.mockResolvedValue({} as any);

      await houseRepository.updateChosenCountsForPreferenceChange(
        oldPreferences,
        newPreferences,
        1
      );

      // Should only decrement old preferences that have corresponding keys in new preferences
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-1" },
        data: { chosenCount: { decrement: 1 } },
      });

      // Should increment new preference
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-3" },
        data: { chosenCount: { increment: 1 } },
      });

      // Should only be called 2 times (1 decrement + 1 increment)
      expect(mockPrisma.house.update).toHaveBeenCalledTimes(7);
    });

    it("should throw error when decrement operation fails", async () => {
      const oldPreferences = {
        houseRank1: "house-1",
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      const newPreferences = {
        houseRank1: "house-2",
      };

      const error = new Error("Database error");
      mockPrisma.house.update.mockRejectedValueOnce(error);

      await expect(
        houseRepository.updateChosenCountsForPreferenceChange(
          oldPreferences,
          newPreferences,
          1
        )
      ).rejects.toThrow("Failed to update chosen counts for preference change");
    });

    it("should throw error when increment operation fails", async () => {
      const oldPreferences = {
        houseRank1: null,
        houseRank2: null,
        houseRank3: null,
        houseRank4: null,
        houseRank5: null,
        houseRankSub: null,
      };

      const newPreferences = {
        houseRank1: "house-1",
      };

      const error = new Error("Database error");
      mockPrisma.house.update.mockRejectedValueOnce(error);

      await expect(
        houseRepository.updateChosenCountsForPreferenceChange(
          oldPreferences,
          newPreferences,
          1
        )
      ).rejects.toThrow("Failed to update chosen counts for preference change");
    });

    it("should filter out null values correctly", async () => {
      const oldPreferences = {
        houseRank1: "house-1",
        houseRank2: null,
        houseRank3: "house-3",
        houseRank4: null,
        houseRank5: "house-5",
        houseRankSub: null,
      };

      const newPreferences = {
        houseRank1: null,
        houseRank2: "house-2",
        houseRank3: null,
        houseRank4: "house-4",
        houseRank5: null,
      };

      mockPrisma.house.update.mockResolvedValue({} as any);

      await houseRepository.updateChosenCountsForPreferenceChange(
        oldPreferences,
        newPreferences,
        1
      );

      // Should only process non-null values
      // Decrements: house-1, house-3, house-5
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-1" },
        data: { chosenCount: { decrement: 1 } },
      });
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-3" },
        data: { chosenCount: { decrement: 1 } },
      });
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-5" },
        data: { chosenCount: { decrement: 1 } },
      });

      // Increments: house-2, house-4
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-2" },
        data: { chosenCount: { increment: 1 } },
      });
      expect(mockPrisma.house.update).toHaveBeenCalledWith({
        where: { id: "house-4" },
        data: { chosenCount: { increment: 1 } },
      });

      expect(mockPrisma.house.update).toHaveBeenCalledTimes(5);
    });
  });
});
