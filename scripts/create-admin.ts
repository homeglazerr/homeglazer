import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

loadEnv({ path: resolve(process.cwd(), '.env') });
loadEnv({ path: resolve(process.cwd(), '.env.local'), override: true });
if (!process.env.DATABASE_URL) {
  loadEnv({ path: resolve(process.cwd(), '.env.production') });
}

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@homeglazer.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  if (!process.env.DATABASE_URL) {
    console.error(
      '❌ DATABASE_URL is not set. Add it to .env or .env.local (or export it) — use the same connection string as AWS Amplify for production.'
    );
    process.exit(1);
  }

  console.log('Creating admin user...');
  console.log(`Email: ${email}`);

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('Admin user already exists!');
    console.log(`ID: ${existing.id}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log(`ID: ${admin.id}`);
  console.log(`Email: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
