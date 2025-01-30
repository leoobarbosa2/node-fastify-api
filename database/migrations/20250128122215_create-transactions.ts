import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (tableBuilder) => {
    tableBuilder.uuid('id').primary()
    tableBuilder.text('title').notNullable()
    tableBuilder.decimal('amount', 10, 2).notNullable()
    tableBuilder.timestamp('c reated_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}

