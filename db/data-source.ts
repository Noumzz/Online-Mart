import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1122',
  database: 'Mart',
  entities: [join(process.cwd(), 'dist/**/*.entity.js')],
  migrations: [join(process.cwd(), 'dist/db/migrations/*.js')],
  migrationsTableName: 'Migrations',
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
