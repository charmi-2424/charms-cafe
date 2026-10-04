import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env['ADMIN_SEED_EMAIL'] ?? 'admin@charmscafe.in';
  const password = process.env['ADMIN_SEED_PASSWORD'];

  if (!password || password.length < 8) {
    console.error('❌ ADMIN_SEED_PASSWORD must be set in .env and be at least 8 characters.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash, role: 'admin' },
    update: { passwordHash },
  });

  console.log(`✅ Admin user ready: ${admin.email} (role: ${admin.role})`);
  console.log('   You can now log in at /admin/login');
}

main()
  .catch(err => { console.error('Seed failed:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
