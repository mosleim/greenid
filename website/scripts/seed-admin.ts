import 'dotenv/config';
import { createDbConnection, adminUsers } from '../src/db/index';
import { hashPassword } from '../src/lib/password';

async function seedAdmin() {
  try {
    console.log('🌱 Seeding admin user...');

    // Create database connection with environment variables
    const db = createDbConnection({
      TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
      TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    });

    // Hash password using edge-compatible PBKDF2
    const passwordHash = await hashPassword('admin123');

    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(adminUsers)
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('⚠️  Admin user already exists. Skipping...');
      return;
    }

    // Insert admin user
    await db.insert(adminUsers).values({
      username: 'admin',
      email: 'admin@buyback.my.id',
      passwordHash: passwordHash,
      role: 'superadmin',
    });

    console.log('✅ Admin user created successfully');
    console.log('');
    console.log('📝 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login');
    console.log('');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

// Run seeder
seedAdmin()
  .then(() => {
    console.log('🎉 Seeding complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
