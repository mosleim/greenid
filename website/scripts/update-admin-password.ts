import 'dotenv/config';
import { createDbConnection, adminUsers } from '../src/db/index';
import { hashPassword } from '../src/lib/password';
import { eq } from 'drizzle-orm';

async function updateAdminPassword() {
  try {
    console.log('🔄 Updating admin password hash to new format...');

    // Create database connection with environment variables
    const db = createDbConnection({
      TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
      TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    });

    // Get existing admin
    const existingAdmin = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, 'admin'))
      .limit(1);

    if (existingAdmin.length === 0) {
      console.log('No admin user found. Run seed:admin first.');
      return;
    }

    // Check if already using new format
    if (existingAdmin[0].passwordHash.startsWith('$pbkdf2$')) {
      console.log('Admin already using PBKDF2 format. No update needed.');
      return;
    }

    // Hash password using edge-compatible PBKDF2
    const newPasswordHash = await hashPassword('admin123');

    // Update admin password
    await db.update(adminUsers)
      .set({ passwordHash: newPasswordHash })
      .where(eq(adminUsers.id, existingAdmin[0].id));

    console.log('Admin password hash updated successfully.');
    console.log('');
    console.log('Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('');
    console.log('IMPORTANT: Change this password after first login.');
    console.log('');
  } catch (error) {
    console.error('Error updating admin password:', error);
    process.exit(1);
  }
}

// Run updater
updateAdminPassword()
  .then(() => {
    console.log('Update complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Update failed:', error);
    process.exit(1);
  });
