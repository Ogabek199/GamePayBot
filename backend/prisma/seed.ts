import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed active payment cards used by the manual-card deposit flow.
  const cardCount = await prisma.paymentCard.count();
  if (cardCount === 0) {
    await prisma.paymentCard.createMany({
      data: [
        {
          cardHolder: 'OGABEK O.',
          cardNumber: '8600 1234 5678 9012',
          bankName: 'Agrobank',
        },
        {
          cardHolder: 'OGABEK O.',
          cardNumber: '9860 5678 1234 9012',
          bankName: 'Humo - TBC Bank',
        },
      ],
    });
    console.log('Seeded payment cards');
  } else {
    console.log('Payment cards already exist, skipping');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
