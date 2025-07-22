import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './services/auth.service';

async function createDefaultAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // Check if admin already exists
    const existingAdmin = await authService.findByEmail('admin@pere-sapin.com');

    if (!existingAdmin) {
      const adminUser = await authService.register({
        email: 'admin@pere-sapin.com',
        password: 'admin123',
        name: 'Administrateur',
      });

      console.log('[SETUP] Default admin user created:');
      console.log('Email: admin@pere-sapin.com');
      console.log('Password: admin123');
      console.log('Please change the password after first login!');
    } else {
      console.log('[SETUP] Admin user already exists');
    }
  } catch (error) {
    console.error('[SETUP] Error creating admin user:', error);
  }

  await app.close();
}

createDefaultAdmin();
