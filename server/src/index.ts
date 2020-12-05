import 'reflect-metadata'
import 'dotenv-safe/config'
import path from 'path'
import express from 'express'
import cors from 'cors'
import sanitize from 'sanitize'
import { createConnection } from 'typeorm'
import { buildSchema } from 'type-graphql'
import { ApolloServer } from 'apollo-server-express'
import { Token } from './entities/Token'
import { UserResolver } from './resolvers/user'
import { ReadResolver } from './resolvers/view'
import { StoryResolver } from './resolvers/story'
import { GenreResolver } from './resolvers/genre'
import { RatingResolver } from './resolvers/rating'
import { ChapterResolver } from './resolvers/chapter'
import { CommentResolver } from './resolvers/comment'
import { SubscriptionResolver } from './resolvers/subscription'
import { createUserLoader } from './utils/createUserLoader'
import { createGenreLoader } from './utils/createGenreLoader'
import { createStoryLoader } from './utils/createStoryLoader'
import { createRatingLoader } from './utils/createRatingLoader'
import { createCommentLoader } from './utils/createCommentLoader'
import { createChapterLoader } from './utils/createChapterLoader'
import { createSubscriptionLoader } from './utils/createSubscriptionLoader'
import { createStoryIdsByUserLoader } from './utils/createStoryIdsByUserLoader'
import { createGenreIdsByStoryLoader } from './utils/createGenreIdsByStoryLoader'
import { createRatingIdsByUserLoader } from './utils/createRatingIdsByUserLoader'
import { createRatingIdsByStoryLoader } from './utils/createRatingIdsByStoryLoader'
import { createChapterIdsByStoryLoader } from './utils/createChapterIdsByStoryLoader'
import { createCommentIdsByStoryLoader } from './utils/createCommentIdsByStoryLoader'
import { createRatingIdsByChapterLoader } from './utils/createRatingIdsByChapterLoader'
import { createCommentIdsByChapterLoader } from './utils/createCommentIdsByChapterLoader'
import { __prod__ } from './constants'

const main = async () => {
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: !__prod__,
    entities: [path.join(__dirname, 'entities', '*.js')],
    migrations: [],
    subscribers: [],
  })

  const app = express()
  app.use(cors())
  app.use(sanitize.middleware)

  const server = new ApolloServer({
    playground: true,
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        ReadResolver,
        StoryResolver,
        GenreResolver,
        RatingResolver,
        CommentResolver,
        ChapterResolver,
        SubscriptionResolver,
      ],
      validate: false,
    }),
    context: async ({ req }) => {
      if (req.body.operationName === 'IntrospectionQuery') {
        return {}
      }

      let me
      let token

      const { authorization } = req.headers
      if (authorization && typeof authorization === 'string') {
        const [bearer, bearerToken] = authorization.split(' ')
        token = bearerToken
        if (bearer === 'Bearer') {
          me = await Token.verifyAndFindUser(token)
        }
      }

      return {
        me,
        token,
        userLoader: createUserLoader(),
        storyLoader: createStoryLoader(),
        genreLoader: createGenreLoader(),
        ratingLoader: createRatingLoader(),
        chapterLoader: createChapterLoader(),
        commentLoader: createCommentLoader(),
        subscriptionLoader: createSubscriptionLoader(),
        storyIdsByUserLoader: createStoryIdsByUserLoader(),
        genreIdsByStoryLoader: createGenreIdsByStoryLoader(),
        ratingIdsByUserLoader: createRatingIdsByUserLoader(),
        ratingIdsByStoryLoader: createRatingIdsByStoryLoader(),
        chapterIdsByStoryLoader: createChapterIdsByStoryLoader(),
        commentIdsByStoryLoader: createCommentIdsByStoryLoader(),
        ratingIdsByChapterLoader: createRatingIdsByChapterLoader(),
        commentIdsByChapterLoader: createCommentIdsByChapterLoader(),
      }
    },
  })

  server.applyMiddleware({ app })

  app.listen(parseInt(process.env.PORT), () => {
    console.log(`Server started on ${process.env.PORT}`)
  })
}

try {
  main()
} catch (error) {
  console.error(error)
}
