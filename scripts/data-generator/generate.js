const { faker } = require('@faker-js/faker');
const pool = require('./db');
const config = require('./config');

// Set locale to India
faker.location = require('@faker-js/faker').en_IN;

async function generateData() {
  console.log('🚀 Starting FinScope Data Generation...');
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Fetch Categories
    console.log('Fetching existing categories...');
    const [categories] = await connection.query('SELECT id, name, type FROM categories');
    const incomeCategories = categories.filter(c => c.type === 'INCOME');
    const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

    if (incomeCategories.length === 0 || expenseCategories.length === 0) {
      throw new Error('Categories not found in database. Run finscope.sql first.');
    }

    // 2. Generate Users
    console.log(`Generating ${config.generation.usersCount} users...`);
    const usersData = [];
    const emails = new Set();

    for (let i = 0; i < config.generation.usersCount; i++) {
      let email;
      do {
        email = faker.internet.email().toLowerCase();
      } while (emails.has(email));
      emails.add(email);

      usersData.push([
        faker.person.fullName(),
        email,
        config.generation.dummyPasswordHash,
        'USER',
        faker.helpers.fromRegExp('+91 [6-9][0-9]{9}'), // Indian phone format
        'INR',
        null, // avatar
        true, // is_active
        new Date(), // created_at
        new Date()  // updated_at
      ]);
    }

    // Insert Users
    const [userResult] = await connection.query(
      `INSERT INTO users (name, email, password, role, phone, currency, avatar, is_active, created_at, updated_at) VALUES ?`,
      [usersData]
    );

    const firstUserId = userResult.insertId;
    const numInsertedUsers = userResult.affectedRows;
    const userIds = Array.from({ length: numInsertedUsers }, (_, i) => firstUserId + i);

    console.log(`✅ Inserted ${numInsertedUsers} users.`);

    // 3. Generate Budgets
    console.log(`Generating budgets...`);
    const budgetsData = [];
    for (const userId of userIds) {
      const numBudgets = faker.number.int({
        min: config.generation.budgetsPerUserMin,
        max: config.generation.budgetsPerUserMax
      });

      // Avoid duplicate categories for the same user in the same month/year
      const selectedCats = faker.helpers.arrayElements(expenseCategories, numBudgets);

      for (const cat of selectedCats) {
        const amount = faker.number.int({
          min: config.generation.budgetAmountMin,
          max: config.generation.budgetAmountMax
        });
        
        budgetsData.push([
          userId,
          cat.id,
          `${cat.name} Budget`,
          amount,
          config.generation.budgetMonth,
          config.generation.budgetYear,
          new Date()
        ]);
      }
    }

    if (budgetsData.length > 0) {
      const [budgetResult] = await connection.query(
        `INSERT INTO budgets (user_id, category_id, name, amount, month, year, created_at) VALUES ?`,
        [budgetsData]
      );
      console.log(`✅ Inserted ${budgetResult.affectedRows} budgets.`);
    }

    // 4. Generate Transactions
    console.log(`Generating transactions...`);
    const transactionsData = [];
    
    for (const userId of userIds) {
      const numTx = faker.number.int({
        min: config.generation.txPerUserMin,
        max: config.generation.txPerUserMax
      });

      for (let i = 0; i < numTx; i++) {
        const isIncome = Math.random() < config.generation.incomeProbability;
        const type = isIncome ? 'INCOME' : 'EXPENSE';
        const category = faker.helpers.arrayElement(isIncome ? incomeCategories : expenseCategories);
        
        const amount = faker.number.int({
          min: isIncome ? config.generation.incomeMin : config.generation.expenseMin,
          max: isIncome ? config.generation.incomeMax : config.generation.expenseMax
        });

        // Date in last 30 days
        const date = faker.date.recent({ days: config.generation.daysHistory });

        transactionsData.push([
          userId,
          category.id,
          amount,
          type,
          `${category.name} transaction`, // description
          date.toISOString().split('T')[0], // YYYY-MM-DD
          faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }), // optional note
          new Date(),
          new Date()
        ]);
      }
    }

    if (transactionsData.length > 0) {
      const [txResult] = await connection.query(
        `INSERT INTO transactions (user_id, category_id, amount, type, description, date, note, created_at, updated_at) VALUES ?`,
        [transactionsData]
      );
      console.log(`✅ Inserted ${txResult.affectedRows} transactions.`);
    }

    // Commit all changes
    await connection.commit();
    console.log('🎉 Generation completed successfully! All data committed to database.');

  } catch (error) {
    console.error('❌ Error during data generation, rolling back...');
    console.error(error);
    await connection.rollback();
  } finally {
    connection.release();
    pool.end();
  }
}

generateData().catch(console.error);
