import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('UserProfiles')
export class UserProfileEntity {
  @PrimaryColumn()
  userId!: number;

  @Column()
  nickName!: string;

  // @OneToOne(
  //   () => UserEntity,
  //   u => u.profile
  // )
  // @JoinColumn()
  // user?: UserEntity;
}
