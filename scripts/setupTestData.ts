import { prisma } from "../src/lib/prisma";
import { PrefixType, RoleType } from "@prisma/client";

async function setup() {
  console.log("🚀 Setting up test data...");

  const houses = await Promise.all([
    prisma.house.create({
      data: {
        nameThai: "บ้านแดง",
        nameEnglish: "Red House",
        descriptionThai: "บ้านสีแดง",
        descriptionEnglish: "The Red House",
        sizeLetter: "L",
        capacity: 100,
        instagram: "@redhouse",
        facebook: "redhouse",
        tiktok: "@redhouse"
      }
    }),
    prisma.house.create({
      data: {
        nameThai: "บ้านน้ำเงิน",
        nameEnglish: "Blue House",
        descriptionThai: "บ้านสีน้ำเงิน",
        descriptionEnglish: "The Blue House",
        sizeLetter: "L",
        capacity: 100,
        instagram: "@bluehouse",
        facebook: "bluehouse",
        tiktok: "@bluehouse"
      }
    }),
    prisma.house.create({
      data: {
        nameThai: "บ้านเขียว",
        nameEnglish: "Green House",
        descriptionThai: "บ้านสีเขียว",
        descriptionEnglish: "The Green House",
        sizeLetter: "M",
        capacity: 80,
        instagram: "@greenhouse",
        facebook: "greenhouse",
        tiktok: "@greenhouse"
      }
    }),
    prisma.house.create({
      data: {
        nameThai: "บ้านเหลือง",
        nameEnglish: "Yellow House",
        descriptionThai: "บ้านสีเหลือง",
        descriptionEnglish: "The Yellow House",
        sizeLetter: "M",
        capacity: 80,
        instagram: "@yellowhouse",
        facebook: "yellowhouse",
        tiktok: "@yellowhouse"
      }
    }),
    prisma.house.create({
      data: {
        nameThai: "บ้านม่วง",
        nameEnglish: "Purple House",
        descriptionThai: "บ้านสีม่วง",
        descriptionEnglish: "The Purple House",
        sizeLetter: "S",
        capacity: 60,
        instagram: "@purplehouse",
        facebook: "purplehouse",
        tiktok: "@purplehouse"
      }
    })
  ]);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        studentId: "6400001",
        citizenId: "1234567890123",
        prefix: PrefixType.MR,
        firstName: "John",
        lastName: "Doe",
        nickname: "John",
        academicYear: 2024,
        faculty: "Engineering",
        password: "password123",
        phoneNumber: "0812345678",
        parentName: "Jane Doe",
        parentPhoneNumber: "0823456789",
        parentRelationship: "Mother",
        role: RoleType.FRESHMAN
      }
    }),
    prisma.user.create({
      data: {
        studentId: "6400002",
        citizenId: "2234567890123",
        prefix: PrefixType.MS,
        firstName: "Alice",
        lastName: "Smith",
        nickname: "Alice",
        academicYear: 2024,
        faculty: "Science",
        password: "password123",
        phoneNumber: "0812345679",
        parentName: "Bob Smith",
        parentPhoneNumber: "0823456790",
        parentRelationship: "Father",
        role: RoleType.FRESHMAN
      }
    }),
    prisma.user.create({
      data: {
        studentId: "6400003",
        citizenId: "3234567890123",
        prefix: PrefixType.MR,
        firstName: "Bob",
        lastName: "Johnson",
        nickname: "Bob",
        academicYear: 2024,
        faculty: "Arts",
        password: "password123",
        phoneNumber: "0812345680",
        parentName: "Mary Johnson",
        parentPhoneNumber: "0823456791",
        parentRelationship: "Mother",
        role: RoleType.FRESHMAN
      }
    }),
    prisma.user.create({
      data: {
        studentId: "6400004",
        citizenId: "4234567890123",
        prefix: PrefixType.MS,
        firstName: "Carol",
        lastName: "Williams",
        nickname: "Carol",
        academicYear: 2024,
        faculty: "Medicine",
        password: "password123",
        phoneNumber: "0812345681",
        parentName: "David Williams",
        parentPhoneNumber: "0823456792",
        parentRelationship: "Father",
        role: RoleType.FRESHMAN
      }
    })
  ]);

  console.log("✅ Test data created successfully!");
  console.log("\n📋 Created Houses:");
  houses.forEach(house => {
    console.log(`  - ${house.nameEnglish} (ID: ${house.id})`);
  });
  
  console.log("\n👥 Created Users:");
  users.forEach(user => {
    console.log(`  - ${user.firstName} ${user.lastName} (ID: ${user.id}, Student ID: ${user.studentId})`);
  });

  console.log("\n🔧 Example API calls:");
  console.log(`\n# Create a group for user ${users[0].firstName}:`);
  console.log(`curl -X POST http://localhost:8080/group \\`);
  console.log(`  -H "x-user-id: ${users[0].id}" \\`);
  console.log(`  -H "Content-Type: application/json"`);
  
  console.log(`\n# Or using student ID:`);
  console.log(`curl -X POST http://localhost:8080/group \\`);
  console.log(`  -H "x-student-id: ${users[0].studentId}" \\`);
  console.log(`  -H "Content-Type: application/json"`);

  console.log(`\n# Set house preferences:`);
  console.log(`curl -X POST http://localhost:8080/group/house-preferences \\`);
  console.log(`  -H "x-user-id: ${users[0].id}" \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{`);
  console.log(`    "houseRank1": "${houses[0].id}",`);
  console.log(`    "houseRank2": "${houses[1].id}",`);
  console.log(`    "houseRank3": "${houses[2].id}",`);
  console.log(`    "houseRank4": null,`);
  console.log(`    "houseRank5": null,`);
  console.log(`    "houseRankSub": "${houses[3].id}"`);
  console.log(`  }'`);
}

setup()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error("❌ Error setting up test data:", error);
    process.exit(1);
  });