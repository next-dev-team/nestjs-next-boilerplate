import { CreateDateColumn, UpdateDateColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'integer', nullable: true })
  createdBy?: number;

  @Column({ type: 'integer', nullable: true })
  updatedBy?: number;
}
