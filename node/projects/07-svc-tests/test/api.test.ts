import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Pool } from 'pg';
import { app, setPool } from '../src/server';

describe('User Service Integration', () => {
  let pool: Pool;
  let container: any;

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres").start();
    pool = new Pool({ connectionString: container.getConnectionUri() });
    setPool(pool);
    await pool.query('CREATE TABLE users (id SERIAL PRIMARY KEY, email TEXT UNIQUE)');
  }, 60000);

  afterAll(async () => {
    await pool.end();
    await container.stop();
  });

  it('POST /users creates a user', async () => {
    const res = await request(app).post('/users').send({ email: 'test@test.com' });
    expect(res.status).toBe(201);
    expect(res.body.email).toBe('test@test.com');
  });
});