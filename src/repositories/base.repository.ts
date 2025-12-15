import { DataSource, ObjectLiteral, Repository } from 'typeorm';

/**
 * Custom Repository with enhance query raw sql statement
 */
interface Deletable extends ObjectLiteral {
  deletedBy?: number;
}

export class BaseRepository<T extends Deletable> extends Repository<T> {
  constructor(dataSource: DataSource, entity: new () => T) {
    super(entity, dataSource.createEntityManager());
  }
  /**
   * Run SQL with key value pair parameters
   *
   * @param sql sql statement
   * @param params sql parameter in key value pair
   * @see https://github.com/typeorm/typeorm/issues/556#issuecomment-317459125
   */
  async $runSQL<T>(sql: string, params: ObjectLiteral): Promise<T> {
    const [q, p] = this.manager.connection.driver.escapeQueryWithParameters(sql, params, {});
    return this.query(q, p);
  }

  /**
   * Soft remove with deletedBy field
   * @description no handle delete relations, must handle yourself either by hook or manually
   * @param id
   * @param deletedBy
   * @returns affected rows
   */
  async $softDelete(id: number, deletedBy: number): Promise<number> {
    // Update the deletedBy field
    const c = await this.update(id, { deletedBy } as any);
    if (c.affected) {
      // Ensure `deletedBy` field is updated in the translations
      const r = await this.findOne({
        where: { id } as any
      });
      if (r) {
        await this.softRemove(r);
      }
    }
    return c.affected || 0;
  }
}
