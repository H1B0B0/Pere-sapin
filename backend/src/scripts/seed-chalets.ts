import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ChaletService } from '../services/chalet.service';

// Données des chalets existants basées sur chaletduperesapin.fr
const chaletsData = [
  {
    id: 'cedre',
    name: 'CÈDRE',
    slug: 'cedre',
    capacity: 10,
    rooms: '3 chambres',
    images: [
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos613cc22398f1a.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos613ccf37ebb09.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos613cc2b6a80c1.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adcbe48fd05.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adb5b8a8b2e.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adb5b6b7f3c.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adb5b4c96ea.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adb5b2de8f8.jpg',
    ],
    mainImage:
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos613cc22398f1a.jpg',
    features: [
      'TV dans chaque chambre',
      'Jacuzzi + 5 peignoirs',
      'Poêle à pellets',
      'Baby-foot de bar',
      'Borne tactile',
      'Plancha extérieure',
      'Table de ping-pong',
      'Parking privé',
      'Karaoké',
      'Jeu de fléchettes',
      'Table de palet Hair Hockey',
      'Tireuse à bière Perfect Draft',
      'Frigo américain',
      'Château gonflable (été)',
      'Machine à laver',
      'Balançoire extérieur',
    ],
    highlights: [
      'Chalet 3 étoiles',
      'Classé Destinations Vosges',
      'Classé Gîtes de France',
      'Linge fourni',
    ],
    prices: {
      weekend: '800-900€',
      week: '1100-1900€',
      holidays: '2200€',
      cleaning: '100€',
    },
    color: 'success',
    icon: 'pine-tree',
    bedrooms:
      '1 chambre 2 lits doubles + 1 chambre lit double + 1 chambre lit double et simple',
    bathrooms: '2 salles de bain (1 douche, 1 baignoire) + 2 toilettes',
    description:
      "Le chalet Cèdre vous accueille dans un cadre authentique et chaleureux. Idéal pour les familles, il dispose d'équipements de loisirs variés et d'un jacuzzi pour des moments de détente absolue.",
    location: 'Les Vosges, France',
    address: 'Chalet du Père Sapin, Les Vosges',
    contactEmail: 'contact@chaletduperesapin.fr',
    contactPhone: '+33611233767',
    isActive: true,
  },
  {
    id: 'epicea',
    name: 'ÉPICÉA',
    slug: 'epicea',
    capacity: 15,
    rooms: '5 chambres',
    images: [
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137dbc36c177.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137dbe0e10b8.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137e0885801d.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adcb0486b21.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137e08a79fe6.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137e08ce0b45.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc6c8cef7e.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc6cbc76ec.jpg',
    ],
    mainImage:
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137dbc36c177.jpg',
    features: [
      'Jacuzzi + Sauna',
      'Appareils de remise en forme',
      'Cheminée',
      'Juke-box',
      'Simulateur de voiture',
      'Machine à coup de poing',
      'Baby-foot de bar',
      'Terrain de boules',
      'Lave-verres professionnel',
      'Machine à glaçons',
      'Refroidisseur à bouteilles',
      'Tireuse à bière Perfect Draft',
      'Borne tactile',
      'Jeu de fléchettes',
      'Hair Hockey',
      'Karaoké',
      'Château gonflable (été)',
      'Barbecue extérieur',
    ],
    highlights: [
      'Chalet 3 étoiles',
      'Classé Destinations Vosges',
      'Espace détente complet',
      'Bar équipé professionnel',
    ],
    prices: {
      weekend: '1600€',
      week: '1900-2800€',
      holidays: '3200€',
      cleaning: '150€',
    },
    color: 'primary',
    icon: 'mountains',
    bedrooms:
      '2 chambres lit double + 1 chambre lit double et simple + 2 chambres 2 lits doubles',
    bathrooms: '4 douches + 1 baignoire + 4 toilettes',
    description:
      "L'Épicéa est notre chalet le plus équipé avec un espace détente exceptionnel incluant sauna, jacuzzi et salle de sport. Parfait pour les grands groupes souhaitant se détendre après une journée en montagne.",
    location: 'Les Vosges, France',
    address: 'Chalet du Père Sapin, Les Vosges',
    contactEmail: 'contact@chaletduperesapin.fr',
    contactPhone: '+33611233767',
    isActive: true,
  },
  {
    id: 'meleze',
    name: 'MÉLÈZE',
    slug: 'meleze',
    capacity: 15,
    rooms: '5 chambres',
    images: [
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137d1c8683c9.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137d1fbecc04.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos613cb12e9ac2c.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc70380583.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc7016e0e6.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc6ff5b8f4.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc6fd4a702.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc6fb39510.jpg',
    ],
    mainImage:
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137d1c8683c9.jpg',
    features: [
      'Jacuzzi',
      'Cheminée',
      'Karaoké',
      'Simulateur rallye',
      'Time Crisis original',
      'Hair Hockey',
      'Tape taupe',
      'Machine à glaçons',
      'Refroidisseur à bouteilles',
      'Tireuse à bière Perfect Draft',
      'Borne tactile',
      'Baby-foot de bar',
      'Jeu de fléchettes',
      'Château gonflable (été)',
      'Barbecue extérieur',
      'Terrain de boules',
      'Machine à laver',
      'Balançoire extérieur',
    ],
    highlights: [
      'Chalet 3 étoiles Gîtes de France',
      'Simulateurs uniques',
      'Espace jeux complet',
      'Équipements modernes',
    ],
    prices: {
      weekend: '1600€',
      week: '1900-2600€',
      holidays: '3200€',
      cleaning: '150€',
    },
    color: 'warning',
    icon: 'leaf',
    bedrooms:
      '2 chambres lit double + 1 chambre lit double et simple + 2 chambres 2 lits doubles',
    bathrooms: '5 douches + 1 baignoire + 3 toilettes',
    description:
      "Le chalet Mélèze offre une expérience de jeu unique avec ses simulateurs et bornes d'arcade. Idéal pour les groupes d'amis et les familles avec adolescents qui recherchent divertissement et convivialité.",
    location: 'Les Vosges, France',
    address: 'Chalet du Père Sapin, Les Vosges',
    contactEmail: 'contact@chaletduperesapin.fr',
    contactPhone: '+33611233767',
    isActive: true,
  },
  {
    id: 'douglas',
    name: 'DOUGLAS',
    slug: 'douglas',
    capacity: 15,
    rooms: '5 chambres',
    images: [
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671f7d3ed8ed.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671f7d58a253.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671f7d72f1ec.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671fedf99008.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671ff655cd71.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671ff67447af.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671ff6933d4d.jpg',
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671ff6b228eb.jpg',
    ],
    mainImage:
      'http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671f7d3ed8ed.jpg',
    features: [
      'NOUVEAU chalet',
      'Salle de jeux 100m²',
      'Jacuzzi privé',
      'Poêle à pellets',
      'Baby-foot de bar',
      'Jeu de fléchettes',
      'Borne tactile',
      'Jeu de palet',
      'Jeu de frappe fête foraine',
      'Jeu basket SEGA',
      'Jeu de danse',
      'Bowling électronique',
      'Jeu de réflexes',
      'Château gonflable (été)',
      'Grande plancha extérieur',
      'Terrasse et bains de soleil',
      'Chambre PMR',
      'Enceinte JBL connectable',
    ],
    highlights: [
      'Dernier né - 2024',
      'Salle de jeux unique 100m²',
      'Chambre PMR accessible',
      'Équipements premium',
    ],
    prices: {
      weekend: '1850€',
      week: '2200-2900€',
      holidays: '3600€',
      cleaning: '150€',
    },
    color: 'secondary',
    icon: 'sparkles',
    bedrooms:
      '2 chambres lit double + 1 chambre lit double et simple + 1 chambre lit double et 2 lits simples + chambre PMR',
    bathrooms: '5 salles de bain avec douche + 4 toilettes',
    description:
      'Notre tout nouveau chalet Douglas (2024) propose une salle de jeux exceptionnelle de 100m² et une accessibilité PMR. Le summum du confort et du divertissement avec les équipements les plus modernes.',
    location: 'Les Vosges, France',
    address: 'Chalet du Père Sapin, Les Vosges',
    contactEmail: 'contact@chaletduperesapin.fr',
    contactPhone: '+33611233767',
    isActive: true,
  },
];

async function seedChalets() {
  console.log('🌲 Démarrage du seed des chalets...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const chaletService = app.get(ChaletService);

  try {
    // Vérifier les chalets existants
    const existingChalets = await chaletService.findAll();
    console.log(`📊 ${existingChalets.length} chalet(s) existant(s) trouvé(s)`);

    for (const chaletData of chaletsData) {
      // Vérifier si le chalet existe déjà
      const existing = existingChalets.find((c) => c.name === chaletData.name);

      if (existing) {
        console.log(`⏭️  Chalet "${chaletData.name}" existe déjà, ignoré`);
        continue;
      }

      // Créer le nouveau chalet
      const createdChalet = await chaletService.create(chaletData);
      console.log(`✅ Chalet "${createdChalet.name}" créé avec succès`);
    }

    console.log('🎉 Seed des chalets terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du seed des chalets:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  seedChalets()
    .then(() => {
      console.log('✨ Script terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}

export { seedChalets };
