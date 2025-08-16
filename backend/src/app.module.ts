import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Schemas
import { User, UserSchema } from './schemas/user.schema';
import { Chalet, ChaletSchema } from './schemas/chalet.schema';
import { Page, PageSchema } from './schemas/page.schema';
import { Availability, AvailabilitySchema } from './schemas/availability.schema';

// Services
import { AuthService } from './services/auth.service';
import { ChaletService } from './services/chalet.service';
import { PageService } from './services/page.service';
import { PdfService } from './services/pdf.service';
import { AvailabilityService } from './services/availability.service';

// Controllers
import { AuthController } from './controllers/auth.controller';
import { ChaletController } from './controllers/chalet.controller';
import { PageController } from './controllers/page.controller';
import { PdfController } from './controllers/pdf.controller';
import { AvailabilityController } from './controllers/availability.controller';

// Strategies
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://database:27017/pere-sapin',
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Chalet.name, schema: ChaletSchema },
      { name: Page.name, schema: PageSchema },
      { name: Availability.name, schema: AvailabilitySchema },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    ChaletController,
    PageController,
    PdfController,
    AvailabilityController,
  ],
  providers: [
    AppService,
    AuthService,
    ChaletService,
    PageService,
    PdfService,
    AvailabilityService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AppModule {}
