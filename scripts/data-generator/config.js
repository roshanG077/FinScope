require('dotenv').config();

module.exports = {
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'RoshanGupta@09',
    database: process.env.DB_NAME || 'finscope_db',
    port: process.env.DB_PORT || 3306,
  },
  generation: {
    usersCount: 50,
    budgetsPerUserMin: 1,
    budgetsPerUserMax: 3,
    budgetAmountMin: 2000,
    budgetAmountMax: 20000,
    budgetMonth: 5,
    budgetYear: 2026,
    txPerUserMin: 5,
    txPerUserMax: 15,
    incomeProbability: 0.20,
    incomeMin: 20000,
    incomeMax: 80000,
    expenseMin: 50,
    expenseMax: 5000,
    daysHistory: 30,
    dummyPasswordHash: '$2b$10$FsKCxY3pXODo1qr/y6EoTeHxB9Ors9JK4r.626l/rL6g1By.cab8u', // "User@123"
  }
};
