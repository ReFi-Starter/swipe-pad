import { db } from './index';
import { categories, achievements } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Insertar categorías
  console.log('Inserting categories...');
  await db.insert(categories).values([
    { name: 'Education', description: 'Educational projects and initiatives', icon: '🎓' },
    { name: 'Climate', description: 'Climate change and environmental projects', icon: '🌍' },
    { name: 'Health', description: 'Healthcare and wellness initiatives', icon: '🏥' },
    { name: 'Wildlife', description: 'Animal conservation and protection', icon: '🦁' },
    { name: 'Open Source', description: 'Open source software and public goods', icon: '💻' },
    { name: 'SocFi', description: 'Social finance and impact investing', icon: '💰' },
    { name: 'Art', description: 'Art and creative projects', icon: '🎨' },
    { name: 'Community', description: 'Local community initiatives', icon: '🏙️' },
  ]).onConflictDoNothing();

  // Insertar logros
  console.log('Inserting achievements...');
  await db.insert(achievements).values([
    {
      icon: '🚀',
      title: 'First Donation',
      description: 'Made your first micro-donation',
      criteria: 'Make at least one donation',
      points: 10,
    },
    {
      icon: '🔥',
      title: 'Streak Master',
      description: 'Donated for 7 days in a row',
      criteria: 'Maintain a 7-day donation streak',
      points: 25,
    },
    {
      icon: '💰',
      title: 'Big Spender',
      description: 'Donated a total of $10',
      criteria: 'Reach $10 in total donations',
      points: 30,
    },
    {
      icon: '🌍',
      title: 'Global Impact',
      description: 'Donated to projects in 5 different categories',
      criteria: 'Donate to 5 different categories',
      points: 40,
    },
    {
      icon: '👑',
      title: 'Leaderboard Champion',
      description: 'Reached the top 3 on the leaderboard',
      criteria: 'Rank among the top 3 donors of the month',
      points: 50,
    },
    {
      icon: '🔍',
      title: 'Community Guardian',
      description: 'Submit 10 verified tags on projects',
      criteria: 'Add 10 tags that get verified',
      points: 20,
    },
    {
      icon: '⭐',
      title: 'Trusted Tagger',
      description: 'Have 50 of your tags confirmed by others',
      criteria: 'Get 50 tags confirmed by other users',
      points: 35,
    },
  ]).onConflictDoNothing();

  console.log('✅ Seeding completed!');
}

// Ejecutar el seeding
seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
}); 