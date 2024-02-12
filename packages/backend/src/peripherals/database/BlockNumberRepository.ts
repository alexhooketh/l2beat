import { Logger } from '@l2beat/backend-tools'
import { ChainId, UnixTime } from '@l2beat/shared-pure'
import { BlockNumberRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from './shared/BaseRepository'
import { Database } from './shared/Database'
import {
  deleteHourlyUntil,
  deleteSixHourlyUntil,
} from './shared/deleteArchivedRecords'

export interface BlockNumberRecord {
  timestamp: UnixTime
  blockNumber: number
  chainId: ChainId
}

export class BlockNumberRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<BlockNumberRepository>>(this)
  }

  async add(record: BlockNumberRecord) {
    const row = toRow(record)
    const knex = await this.knex()
    await knex('block_numbers').insert(row)
    return `[chainId | ${record.chainId.toString()}]: ${Number(
      record.blockNumber,
    )}`
  }

  async addMany(records: BlockNumberRecord[]) {
    const rows = records.map(toRow)
    const knex = await this.knex()
    await knex.batchInsert('block_numbers', rows, 10_000)
    return rows.length
  }

  async getAll(): Promise<BlockNumberRecord[]> {
    const knex = await this.knex()
    const rows = await knex('block_numbers')
    return rows.map(toRecord)
  }

  async getAllByChainId(chainId: ChainId): Promise<BlockNumberRecord[]> {
    const knex = await this.knex()
    const rows = await knex('block_numbers')
      .where('chain_id', '=', Number(chainId))
      .select('unix_timestamp', 'block_number', 'chain_id')
    return rows.map(toRecord)
  }

  async findByTimestamp(
    chainId: ChainId,
    timestamp: UnixTime,
  ): Promise<BlockNumberRecord | undefined> {
    const knex = await this.knex()
    const row = await knex('block_numbers')
      .where('unix_timestamp', '=', timestamp.toDate())
      .andWhere('chain_id', '=', Number(chainId))
      .first()
    return row ? toRecord(row) : undefined
  }

  async deleteAll() {
    const knex = await this.knex()
    return knex('block_numbers').delete()
  }
  async deleteHourlyUntil(to: UnixTime, from: UnixTime | undefined) {
    const knex = await this.knex()
    return deleteHourlyUntil(knex, 'block_numbers', to, from)
  }

  async deleteSixHourlyUntil(to: UnixTime, from: UnixTime | undefined) {
    const knex = await this.knex()
    return deleteSixHourlyUntil(knex, 'block_numbers', to, from)
  }
}

function toRow(record: BlockNumberRecord): BlockNumberRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
    chain_id: Number(record.chainId),
  }
}

function toRecord(row: BlockNumberRow): BlockNumberRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    blockNumber: row.block_number,
    chainId: ChainId(row.chain_id),
  }
}
