const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding started...");

    const commonPassword = await bcrypt.hash('123456', 10);

    // 1. Create Default Admin
    const admin = await prisma.user.upsert({
        where: { email: 'news12@gmail.com' },
        update: { password: commonPassword },
        create: {
            name: 'Super Admin',
            email: 'news12@gmail.com',
            password: commonPassword,
            role: 'ADMIN',
            status: 'ACTIVE',
            bio: 'Chief editor and system administrator.',
            avatar: 'https://i.pravatar.cc/150?u=admin'
        }  
    });
    console.log("Admin ensured:", admin.email);

    // 2. Create Sample Authors
    const authorsData = [
        { name: 'Author One', email: 'author1@gmail.com', bio: 'Senior reporter for special projects.' },
        { name: 'Author Two', email: 'author2@gmail.com', bio: 'Lifestyle and culture columnist.' },
        { name: 'Ariful Islam', email: 'ariful@news.com', bio: 'Senior crime reporter with 10 years experience.' },
        { name: 'Sultana Razia', email: 'razia@news.com', bio: 'Lifestyle and culture enthusiast.' },
        { name: 'Kamal Ahmed', email: 'kamal@news.com', bio: 'Sports analyst and former athlete.' },
        { name: 'Nasrin Akter', email: 'nasrin@news.com', bio: 'Economics correspondent focusing on local markets.' },
        { name: 'Tanvir Hasan', email: 'tanvir@news.com', bio: 'Tech reviewer and gadget geek.' }
    ];

    for (const data of authorsData) {
        const author = await prisma.user.upsert({
            where: { email: data.email },
            update: { password: commonPassword },
            create: {
                ...data,
                password: commonPassword,
                role: 'AUTHOR',
                status: 'ACTIVE',
                avatar: `https://i.pravatar.cc/150?u=${data.email}`
            }
        });
        console.log(`Author ensured: ${author.name} (${author.email})`);
    }
    
    // 3. Create Basic Tags
    const tags = [
        { name: 'Breaking News', slug: 'breaking-news' },
        { name: 'Hot News', slug: 'hot-news' },
        { name: 'Exclusive', slug: 'exclusive' },
        { name: 'Politics', slug: 'politics' },
        { name: 'International', slug: 'international' }
    ];

    for (const tag of tags) {
        await prisma.tag.upsert({
            where: { slug: tag.slug },
            update: {},
            create: tag
        });
    }
    console.log("Tags seeded.");

    // 4. Create Categories
    const categories = [
        { name: 'General', slug: 'general' },
        { name: 'Politics', slug: 'politics' },
        { name: 'Sports', slug: 'sports' },
        { name: 'Health', slug: 'health' }
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat
        });
    }
    console.log("Categories seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Seeding completed successfully.");
  });
