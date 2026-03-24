import { config } from 'dotenv'
import path from 'path'
import { DataSource } from 'typeorm';

config({
    path: [
        path.join(__dirname, `../env/.env.${process.env.NODE_ENV || 'development'}`),
    ]
});

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
});