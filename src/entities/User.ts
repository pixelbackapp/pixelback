import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { ObjectType, Field } from 'type-graphql'
import { UserRole } from '../types'
import { Token } from './Token'
import { Story } from './Story'

@ObjectType()
@Entity()
export class User extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Field()
  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Field()
  @Column({ type: "int" })
  role: UserRole

  @Field()
  @Column()
  displayName: string

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[]

  @OneToMany(() => Story, (story) => story.author)
  stories: Story[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}
