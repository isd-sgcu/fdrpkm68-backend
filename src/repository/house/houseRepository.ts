import { House, Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class HouseRepository {
  async getAllHouses(): Promise<House[]> {
    try {
      return await prisma.house.findMany({
        orderBy: [
          { chosenCount: 'desc' },
          { nameEnglish: 'asc' },
        ],
      });
    } catch (error) {
      console.error("Error getting all houses:", error);
      throw new Error("Failed to get houses");
    }
  }

  async findHouseById(houseId: string): Promise<House | null> {
    try {
      return await prisma.house.findUnique({
        where: { id: houseId },
      });
    } catch (error) {
      console.error("Error finding house by ID:", error);
      throw new Error("Failed to find house");
    }
  }

  async findHousesByIds(houseIds: string[]): Promise<House[]> {
    try {
      return await prisma.house.findMany({
        where: {
          id: { in: houseIds },
        },
      });
    } catch (error) {
      console.error("Error finding houses by IDs:", error);
      throw new Error("Failed to find houses");
    }
  }

  async incrementChosenCounts(
    houseIds: string[],
    tx?: PrismaClient | Prisma.TransactionClient
  ): Promise<void> {
    const client = tx || prisma;
    
    try {
      if (houseIds.length === 0) return;

      const validHouseIds = houseIds.filter(id => id !== null);
      
      for (const houseId of validHouseIds) {
        await client.house.update({
          where: { id: houseId },
          data: {
            chosenCount: {
              increment: 1,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error incrementing chosen counts:", error);
      throw new Error("Failed to increment chosen counts");
    }
  }

  async decrementChosenCounts(
    houseIds: string[],
    tx?: PrismaClient | Prisma.TransactionClient
  ): Promise<void> {
    const client = tx || prisma;
    
    try {
      if (houseIds.length === 0) return;

      const validHouseIds = houseIds.filter(id => id !== null);
      
      for (const houseId of validHouseIds) {
        await client.house.update({
          where: { id: houseId },
          data: {
            chosenCount: {
              decrement: 1,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error decrementing chosen counts:", error);
      throw new Error("Failed to decrement chosen counts");
    }
  }

  async updateChosenCountsForPreferenceChange(
    oldPreferences: {
      houseRank1: string | null;
      houseRank2: string | null;
      houseRank3: string | null;
      houseRank4: string | null;
      houseRank5: string | null;
      houseRankSub: string | null;
    },
    newPreferences: {
      houseRank1: string | null;
      houseRank2: string | null;
      houseRank3: string | null;
      houseRank4: string | null;
      houseRank5: string | null;
      houseRankSub: string | null;
    },
    tx?: PrismaClient | Prisma.TransactionClient
  ): Promise<void> {
    const client = tx || prisma;

    try {
      const oldRankedHouses = [
        oldPreferences.houseRank1,
        oldPreferences.houseRank2,
        oldPreferences.houseRank3,
        oldPreferences.houseRank4,
        oldPreferences.houseRank5,
      ].filter(id => id !== null) as string[];

      const newRankedHouses = [
        newPreferences.houseRank1,
        newPreferences.houseRank2,
        newPreferences.houseRank3,
        newPreferences.houseRank4,
        newPreferences.houseRank5,
      ].filter(id => id !== null) as string[];

      await this.decrementChosenCounts(oldRankedHouses, client);

      await this.incrementChosenCounts(newRankedHouses, client);
    } catch (error) {
      console.error("Error updating chosen counts for preference change:", error);
      throw new Error("Failed to update chosen counts for preference change");
    }
  }

  async getHousesByPopularity(): Promise<House[]> {
    try {
      return await prisma.house.findMany({
        orderBy: [
          { chosenCount: 'desc' },
          { nameEnglish: 'asc' },
        ],
      });
    } catch (error) {
      console.error("Error getting houses by popularity:", error);
      throw new Error("Failed to get houses by popularity");
    }
  }

  async getAvailableHouses(): Promise<House[]> {
    try {
      return await prisma.house.findMany({
        where: {
          chosenCount: {
            lt: prisma.house.fields.capacity,
          },
        },
        orderBy: [
          { chosenCount: 'asc' },
          { nameEnglish: 'asc' },
        ],
      });
    } catch (error) {
      console.error("Error getting available houses:", error);
      throw new Error("Failed to get available houses");
    }
  }

  async hasAvailableCapacity(houseId: string): Promise<boolean> {
    try {
      const house = await prisma.house.findUnique({
        where: { id: houseId },
        select: { chosenCount: true, capacity: true },
      });

      if (!house) return false;
      return house.chosenCount < house.capacity;
    } catch (error) {
      console.error("Error checking house capacity:", error);
      throw new Error("Failed to check house capacity");
    }
  }

  async validateHouseIds(houseIds: (string | null)[]): Promise<boolean> {
    try {
      const validIds = houseIds.filter(id => id !== null) as string[];
      if (validIds.length === 0) return true;

      const houses = await prisma.house.findMany({
        where: {
          id: { in: validIds },
        },
        select: { id: true },
      });

      return houses.length === validIds.length;
    } catch (error) {
      console.error("Error validating house IDs:", error);
      throw new Error("Failed to validate house IDs");
    }
  }

  async getChosenCountStats(): Promise<{
    totalGroups: number;
    averageChosenCount: number;
    mostPopularHouse: House | null;
    leastPopularHouse: House | null;
  }> {
    try {
      const houses = await prisma.house.findMany({
        orderBy: { chosenCount: 'desc' },
      });

      const totalChosenCount = houses.reduce((sum, house) => sum + house.chosenCount, 0);
      const averageChosenCount = houses.length > 0 ? totalChosenCount / houses.length : 0;

      return {
        totalGroups: totalChosenCount / 5,
        averageChosenCount,
        mostPopularHouse: houses[0] || null,
        leastPopularHouse: houses[houses.length - 1] || null,
      };
    } catch (error) {
      console.error("Error getting chosen count stats:", error);
      throw new Error("Failed to get chosen count statistics");
    }
  }
}