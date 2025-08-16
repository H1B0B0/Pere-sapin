import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../services/auth.service';
import { seedChalets } from './seed-chalets';

async function setupInitialData() {
  console.log('🚀 Configuration initiale de l\'application...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // 1. Créer l'admin par défaut
    console.log('👤 Création de l\'utilisateur admin...');
    
    const existingAdmin = await authService.findByEmail('admin@pere-sapin.com');
    
    if (!existingAdmin) {
      const adminUser = await authService.register({
        email: 'admin@pere-sapin.com',
        password: 'admin123',
        name: 'Administrateur'
      });
      
      console.log('✅ Utilisateur admin créé:', adminUser.email);
    } else {
      console.log('⏭️  Utilisateur admin existe déjà, ignoré');
    }

    await app.close();

    // 2. Créer les chalets
    console.log('\n🌲 Création des chalets...');
    await seedChalets();

    console.log('\n🎉 Configuration initiale terminée avec succès !');
    console.log('📝 Informations de connexion admin :');
    console.log('   Email: admin@pere-sapin.com');
    console.log('   Mot de passe: admin123');
    console.log('   URL: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration initiale:', error);
    throw error;
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  setupInitialData()
    .then(() => {
      console.log('✨ Setup terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

export { setupInitialData };