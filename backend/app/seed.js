require("dotenv").config();
const bcrypt = require("bcrypt");
const prisma = require("./db_query/prisma");

const ADMIN_EMAIL = "hhshiblu5555@gmail.com";
const ADMIN_PASSWORD = "123456";

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.issue.deleteMany();
    await tx.postTag.deleteMany();
    await tx.post.deleteMany();
    await tx.teamMember.deleteMany();
    await tx.department.deleteMany();
    await tx.partner.deleteMany();
    await tx.advertisement.deleteMany();
    await tx.publicSubmission.deleteMany();
    await tx.newsletterSubscriber.deleteMany();
    await tx.contactMessage.deleteMany();
    await tx.story.deleteMany();
    await tx.tag.deleteMany();
    await tx.category.deleteMany({ where: { parentId: { not: null } } });
    await tx.category.deleteMany();
    await tx.setting.deleteMany();
    await tx.siteConfig.deleteMany();
    await tx.user.deleteMany();
  });

  const password = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: ADMIN_EMAIL,
      password,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(`Seeded single admin: ${ADMIN_EMAIL} (password: ${ADMIN_PASSWORD})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
