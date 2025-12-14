import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { UserSeeder } from '@seeds/user.seed';
import { LoggerService } from '@lib/logger/logger.service';

async function runSeeders() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const logger = app.get(LoggerService);

  try {
    logger.log('🌱 Starting database seeding...');

    // Run seeders
    const userSeeder = new UserSeeder(dataSource);
    await userSeeder.run();

    logger.log('✅ Database seeding completed successfully');
  } catch (error) {
    // @ts-ignore
    logger.error('❌ Database seeding failed', error.stack);
    throw error;
  } finally {
    await app.close();
  }
}

runSeeders()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
