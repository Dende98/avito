require('dotenv').config();

const { Client } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const targetUrl = new URL(databaseUrl);
const databaseName = targetUrl.pathname.replace('/', '');
const adminUrl = new URL(databaseUrl);
adminUrl.pathname = '/postgres';

const escapeLiteral = (value) => value.replaceAll("'", "''");
const escapeIdentifier = (value) => `"${value.replaceAll('"', '""')}"`;

async function main() {
  const client = new Client({ connectionString: adminUrl.toString() });
  await client.connect();

  const existingDatabase = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = '${escapeLiteral(databaseName)}'`,
  );

  if (existingDatabase.rowCount === 0) {
    await client.query(`CREATE DATABASE ${escapeIdentifier(databaseName)}`);
    console.log(`created=${databaseName}`);
  } else {
    console.log(`exists=${databaseName}`);
  }

  await client.end();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
