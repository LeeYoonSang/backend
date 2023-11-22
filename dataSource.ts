import * as path from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.dev' });

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: true,
  entities: [path.join(__dirname, 'src/entities/**/*.entitiy.{js,ts}'), path.join(__dirname, 'dist/entities/**/*.entity.{js,ts}')],
  synchronize: false,
  timezone: 'Z',
});
