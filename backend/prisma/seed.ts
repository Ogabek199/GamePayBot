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

  // Seed Games and Packages
  const gameCount = await prisma.game.count();
  if (gameCount === 0) {
    const pubg = await prisma.game.create({
      data: {
        name: 'PUBG Mobile',
        slug: 'pubg-mobile',
        logo: 'https://img.tapimg.net/market/lcs/a1715694b7c152a4f6645a86d5e12812_360.png',
        status: 'active',
        packages: {
          create: [
            { title: '60 UC', amount: 60, price: 12000, status: 'active' },
            { title: '325 UC', amount: 325, price: 60000, status: 'active' },
            { title: '660 UC', amount: 660, price: 120000, status: 'active' },
          ],
        },
      },
    });

    const mlbb = await prisma.game.create({
      data: {
        name: 'Mobile Legends',
        slug: 'mobile-legends',
        logo: 'https://gwy-res.moonton.com/mlbb/home/logo.png',
        status: 'active',
        packages: {
          create: [
            { title: '86 Diamonds', amount: 86, price: 18000, status: 'active' },
            { title: '172 Diamonds', amount: 172, price: 35000, status: 'active' },
            { title: '257 Diamonds', amount: 257, price: 52000, status: 'active' },
          ],
        },
      },
    });

    console.log('Seeded games and packages');
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
