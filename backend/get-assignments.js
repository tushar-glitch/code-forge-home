const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const assignments = await prisma.testAssignment.findMany({
    select: {
      id: true,
      access_link: true,
      status: true,
    },
  });
  console.log("Found test assignments:");
  console.table(assignments);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
