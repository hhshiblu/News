require('dotenv').config();
const prisma = require('./app/db_query/prisma');

async function main() {
  // Clear existing to avoid unique constraint if not wiped
  await prisma.user.deleteMany({});
  
  await prisma.user.createMany({
    data: [
      { id: "1a-b4a1-432a-bc91-3e4b787cc8e1", name: "Sarah Collins", email: "sarah@labourpulse.com", password: "hash", role: "RESEARCH_AUTHOR", status: "ACTIVE", bio: "Leading investigative labor metrics reporter." },
      { id: "2a-b4a1-432a-bc91-3e4b787cc8e2", name: "John Doe", email: "john@labourpulse.com", password: "hash", role: "REPORTER", status: "PENDING", bio: "On-site action writer tracking strikes globally." },
      { id: "3a-b4a1-432a-bc91-3e4b787cc8e3", name: "Alice Smith", email: "alice@labourpulse.com", password: "hash", role: "REPORTER", status: "ACTIVE", bio: "Former union lawyer breaking complex legislations." },
      { id: "4a-b4a1-432a-bc91-3e4b787cc8e4", name: "David Kim", email: "david@labourpulse.com", password: "hash", role: "REPORTER", status: "BLOCKED", bio: "Pending credential review currently." }
    ]
  });
  console.log("Database Seed Verified.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
