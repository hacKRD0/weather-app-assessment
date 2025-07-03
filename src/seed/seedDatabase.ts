// src/seed/seedDatabase.ts
import { AppDataSource } from '../config/data-source.js';
import { WeatherRecord } from '../entities/WeatherRecord.js';
import { faker } from '@faker-js/faker';
import { addDays, subDays, formatISO } from 'date-fns';

export async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  // Initialize the data source
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const weatherRepo = AppDataSource.getRepository(WeatherRecord);
  
  // Clear existing data
  await weatherRepo.clear();
  console.log('🧹 Cleared existing data');

  const locations = [
    'New York,US',
    'London,UK',
    'Tokyo,JP',
    'Sydney,AU',
    'Berlin,DE'
  ];

  const records: Partial<WeatherRecord>[] = [];
  const today = new Date();
  
  // Generate data for each location
  for (const location of locations) {
    // Generate data for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = subDays(today, 29 - i); // Go from 29 days ago to today
      const baseTemp = faker.number.float({ min: 5, max: 30, fractionDigits: 1 });
      
      records.push({
        location,
        date: formatISO(date, { representation: 'date' }), // YYYY-MM-DD
        temperature: faker.number.float({ 
          min: baseTemp - 5, 
          max: baseTemp + 5, 
          fractionDigits: 1 
        }),
        description: faker.helpers.arrayElement([
          'Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorm', 'Snowy'
        ])
      });
    }
  }

  // Save in batches of 50 to avoid memory issues
  const batchSize = 50;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await weatherRepo.save(batch);
    console.log(`✅ Seeded batch ${i / batchSize + 1} of ${Math.ceil(records.length / batchSize)}`);
  }

  console.log('🎉 Database seeded successfully!');
  await AppDataSource.destroy();
}

// Run if called directly
if (import.meta.url.endsWith(process.argv[1])) {
  seedDatabase().catch(console.error);
}