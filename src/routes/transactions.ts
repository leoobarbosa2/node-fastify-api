import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto, { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/checkSessionIdExists'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', {
    preHandler: [checkSessionIdExists],
  }, async (request, reply) => {
    const { sessionId } = request.cookies

    if(!sessionId) {
      return reply.status(401).send({
        error: 'User not authorized',
      })
    }

    const transactions = await knex('transactions')
      .where('session_id',sessionId)
      .select()

    return reply.status(200).send({ transactions })
  })

  app.get('/:id',{
    preHandler: [checkSessionIdExists],
  }, async(request, reply) => {
    const { sessionId } = request.cookies
    const getTransactionQueryParamSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionQueryParamSchema.parse(request.params)

    const transaction = await knex('transactions').where({
      id: id,
      session_id: sessionId,
    }).first()

    return reply.status(200).send({ transaction })
  })

  app.get('/summary', {
    preHandler: [checkSessionIdExists],
  }, async (request) => {
    const { sessionId } = request.cookies
    const summary = await knex('transactions')
      .where({ session_id: sessionId })
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions')
      .insert({
        id: crypto.randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId,
      })

    return reply.status(201).send()
  })
}