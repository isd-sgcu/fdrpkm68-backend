import { HouseUseCase } from "./houseUsecase";
import { HouseRepository } from "@/repository/house/houseRepository";
import { House } from "@/types/house/house";

// Mock HouseRepository
jest.mock("@/repository/house/houseRepository");

describe("HouseUseCase", () => {
  let houseUseCase: HouseUseCase;
  let mockHouseRepository: jest.Mocked<HouseRepository>;

  beforeEach(() => {
    mockHouseRepository = {
      getAllHouses: jest.fn(),
      getHouseById: jest.fn(),
    } as any;

    // Mock the constructor to return our mocked repository
    (
      HouseRepository as jest.MockedClass<typeof HouseRepository>
    ).mockImplementation(() => mockHouseRepository);

    houseUseCase = new HouseUseCase();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockHouse: House = {
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

  describe("getHouseById", () => {
    it("should return house when found", async () => {
      mockHouseRepository.getHouseById.mockResolvedValue(mockHouse);

      const result = await houseUseCase.getHouseById("house-1");

      expect(mockHouseRepository.getHouseById).toHaveBeenCalledWith("house-1");
      expect(result).toEqual(mockHouse);
    });

    it("should return null when house not found", async () => {
      mockHouseRepository.getHouseById.mockResolvedValue(null);

      const result = await houseUseCase.getHouseById("non-existent");

      expect(mockHouseRepository.getHouseById).toHaveBeenCalledWith(
        "non-existent"
      );
      expect(result).toBeNull();
    });

    it("should throw error when repository throws error", async () => {
      const repositoryError = new Error("Database connection failed");
      mockHouseRepository.getHouseById.mockRejectedValue(repositoryError);

      await expect(houseUseCase.getHouseById("house-1")).rejects.toThrow(
        "Failed to get house by ID: Database connection failed"
      );
    });

    it("should handle unknown errors from repository", async () => {
      mockHouseRepository.getHouseById.mockRejectedValue("Unknown error");

      await expect(houseUseCase.getHouseById("house-1")).rejects.toThrow(
        "Failed to get house by ID: Unknown error"
      );
    });
  });

  describe("getAllHouses", () => {
    it("should return all houses successfully", async () => {
      const mockHouses = [
        mockHouse,
        { ...mockHouse, id: "house-2", nameThai: "บ้านไทย 2" },
      ];
      mockHouseRepository.getAllHouses.mockResolvedValue(mockHouses);

      const result = await houseUseCase.getAllHouses();

      expect(mockHouseRepository.getAllHouses).toHaveBeenCalledWith();
      expect(result).toEqual(mockHouses);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when no houses exist", async () => {
      mockHouseRepository.getAllHouses.mockResolvedValue([]);

      const result = await houseUseCase.getAllHouses();

      expect(mockHouseRepository.getAllHouses).toHaveBeenCalledWith();
      expect(result).toEqual([]);
    });

    it("should throw error when repository throws error", async () => {
      const repositoryError = new Error("Database connection failed");
      mockHouseRepository.getAllHouses.mockRejectedValue(repositoryError);

      await expect(houseUseCase.getAllHouses()).rejects.toThrow(
        "Failed to get all houses: Database connection failed"
      );
    });

    it("should handle unknown errors from repository", async () => {
      mockHouseRepository.getAllHouses.mockRejectedValue("Unknown error");

      await expect(houseUseCase.getAllHouses()).rejects.toThrow(
        "Failed to get all houses: Unknown error"
      );
    });
  });
});
