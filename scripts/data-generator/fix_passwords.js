const pool = require('./db');
const config = require('./config');

async function fix() {
  console.log('Fixing passwords...');
  const hash = '$2b$10$FsKCxY3pXODo1qr/y6EoTeHxB9Ors9JK4r.626l/rL6g1By.cab8u';
  await pool.query('UPDATE users SET password = ? WHERE role != ?', [hash, 'ADMIN']);
  console.log('Done!');
  process.exit(0);
}

fix();
