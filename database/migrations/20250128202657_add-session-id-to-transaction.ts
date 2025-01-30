import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (tableBuilder) => {
    tableBuilder.uuid('session_id').after('id').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (tableBuilder) => {
    tableBuilder.dropColumn('session_id')
  })
}

