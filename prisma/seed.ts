import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: 'tomasborek3@gmail.com' },
    update: {},
    create: {
      email: 'tomasborek3@gmail.com',
      name: 'Tomáš Bořek',
      role: 'DEVELOPER',
      verified: true,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
