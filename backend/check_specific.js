const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSpecificCategories() {
  const politics = await prisma.category.findUnique({
    where: { slug: 'politics' },
    include: { children: true }
  });
  
  const hasan = await prisma.category.findUnique({
    where: { slug: 'hasan' },
    include: { parent: true }
  });

  const posts = await prisma.post.findMany({
    where: {
      category: {
        slug: 'hasan'
      }
    },
    include: { category: true }
  });

  console.log('Politics Category:', JSON.stringify(politics, null, 2));
  console.log('Hasan Category:', JSON.stringify(hasan, null, 2));
  console.log('Posts count for Hasan:', posts.length);
  if (posts.length > 0) {
    console.log('Sample Post for Hasan:', JSON.stringify(posts[0], null, 2));
  }
  
  await prisma.$disconnect();
}

checkSpecificCategories();
