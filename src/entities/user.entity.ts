import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

  // @OneToOne(
  //   () => UserProfileEntity,
  //   p => p.user
  // )
  // @JoinColumn({ name: 'id' })
  // profile!: UserProfileEntity;
}
