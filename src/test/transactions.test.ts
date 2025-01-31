import { expect, beforeAll, afterAll, describe, it, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app'

describe('Transactions Routes', () => {
  beforeAll(async() => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const transaction = await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = transaction.get('Set-Cookie')

    const transactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies as string[])
      .expect(200)

    expect(transactions.body.transactions).toEqual([
      expect.objectContaining({
        title: 'new transaction',
        amount: 5000,
      }),
    ])
  })

  it('should be able to list a single transaction', async () => {
    const transaction = await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = transaction.get('Set-Cookie')

    const transactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies as string[])
      .expect(200)

    const transactionId = transactions.body.transactions[0].id

    const getTransactionByIdReponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies as string[])
      .expect(200)

    expect(getTransactionByIdReponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'new transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get summary from transactions', async () => {
    const transaction = await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = transaction.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies as string[])
      .send({
        title: 'Debit transaction',
        amount: 3000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies as string[])
      .expect(200)

    expect(summaryResponse.body.summary.amount).toEqual(2000)
  })
})
