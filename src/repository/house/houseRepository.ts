import { Prisma, PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { UUID } from "@/types/common";
import { House } from "@/types/house/house";
import { HouseModel } from "@/types/models";


export class HouseRepository {
  async getAllHouses(): Promise<House[]> {
    try {
      const houses = await prisma.house.findMany({
        orderBy: {
          id: "asc",
        },
      });

      return houses.map((house: HouseModel) => ({
        id: house.id,
        nameThai: house.nameThai,
        nameEnglish: house.nameEnglish,
        descriptionThai: house.descriptionThai,
        descriptionEnglish: house.descriptionEnglish,
        sizeLetter: house.sizeLetter,
        chosenCount: house.chosenCount,
        capacity: house.capacity,
        instagram: house.instagram,
        facebook: house.facebook,
        tiktok: house.tiktok,
      }));
    } catch (error) {
      throw new Error(
        `Database error in getAllHouses: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getHouseById(id: UUID): Promise<House | null> {
    try {
      const house = await prisma.house.findUnique({
        where: {
          id: id,
        },
      });

      if (!house) return null;

      return {
        id: house.id,
        nameThai: house.nameThai,
        nameEnglish: house.nameEnglish,
        descriptionThai: house.descriptionThai,
        descriptionEnglish: house.descriptionEnglish,
        sizeLetter: house.sizeLetter,
        chosenCount: house.chosenCount,
        capacity: house.capacity,
        instagram: house.instagram,
        facebook: house.facebook,
        tiktok: house.tiktok,
      };
    } catch (error) {
      throw new Error(
        `Database error in getHouseById: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async updateHouseMemberCount(
    houseId: string,
    memberCount: number
  ): Promise<void> {
    try {
      await prisma.house.update({
        where: {
          id: houseId,
        },
        data: {
          chosenCount: memberCount,
        },
      });
    } catch (error) {
      throw new Error(
        `Database error in updateHouseMemberCount: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async validateHouseIds(houseIds: (string | null)[]): Promise<boolean> {
    try {
      const validIds = houseIds.filter((id) => id !== null) as string[];
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

  async incrementChosenCounts(
    houseIds: string[],
    tx?: PrismaClient | Prisma.TransactionClient
  ): Promise<void> {
    const client = tx || prisma;

    try {
      if (houseIds.length === 0) return;

      const validHouseIds = houseIds.filter((id) => id !== null);

      for (const houseId of validHouseIds) {
        await client.house.update({
          where: { id: houseId },
          data: {
            chosenCount: {
              increment: 1,
            },
          },
        });
        console.log(`Incremented chosen count for house ${houseId}`);
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

      const validHouseIds = houseIds.filter((id) => id !== null);

      for (const houseId of validHouseIds) {
        await client.house.update({
          where: { id: houseId },
          data: {
            chosenCount: {
              decrement: 1,
            },
          },
        });
        console.log(`Decremented chosen count for house ${houseId}`);
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
      houseRank1?: string | null;
      houseRank2?: string | null;
      houseRank3?: string | null;
      houseRank4?: string | null;
      houseRank5?: string | null;
      houseRankSub?: string | null;
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
      ].filter((id) => id !== null) as string[];
      console.log("Old Ranked Houses:", oldRankedHouses);

      const newRankedHouses = [
        newPreferences.houseRank1,
        newPreferences.houseRank2,
        newPreferences.houseRank3,
        newPreferences.houseRank4,
        newPreferences.houseRank5,
      ].filter((id) => id !== null) as string[];

      await this.decrementChosenCounts(oldRankedHouses, client);

      await this.incrementChosenCounts(newRankedHouses, client);
    } catch (error) {
      console.error(
        "Error updating chosen counts for preference change:",
        error
      );
      throw new Error("Failed to update chosen counts for preference change");
    }
  }
}
