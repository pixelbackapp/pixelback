import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'
import { User } from './User'
import { Chapter } from './Chapter'
import { PublishStatus } from '../types'
import { Rating } from './Rating'

@ObjectType()
@Entity()
export class Story extends BaseEntity {

  @Field()
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  authorId: string

  @ManyToOne(() => User, (user) => user.stories, {
    onDelete: "CASCADE"
  })
  author: User

  @OneToMany(() => Chapter, (chapter) => chapter.story)
  chapters: Chapter[]

  @Column()
  @Field()
  title: string

  @Column("text")
  @Field()
  body: string

  @Column("text")
  @Field()
  summary: string

  @Column()
  @Field()
  enableCommenting: boolean

  @Column("int")
  @Field(() => Int)
  status: PublishStatus

  @OneToMany(() => Rating, (rating) => rating.story)
  ratings: Rating[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}