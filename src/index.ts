import "reflect-metadata"
import "dotenv-safe/config"
import path from "path"
import { createConnection } from "typeorm"
import { buildSchema } from "type-graphql"
import express from "express"
import cors from "cors"
import { ApolloServer } from "apollo-server-express"
import { Token } from './entities/Token'
import { UserResolver } from './resolvers/user'
import { StoryResolver } from './resolvers/story'
import { RatingResolver } from "./resolvers/rating"
import { createUserLoader } from './utils/createUserLoader'
import { createStoryLoader } from './utils/createStoryLoader'
import { createChapterLoader } from './utils/createChapterLoader'
import { createRatingLoader } from './utils/createRatingLoader'
import { createSubscriptionLoader } from './utils/createSubscriptionLoader'
import { __prod__ } from './constants'

const main = async () => {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: !__prod__,
    entities: [
      path.join(__dirname, "entities", "*.js")
    ],
    migrations: [],
    subscribers: []
  })

  const app = express()
  app.use(cors())

  const server = new ApolloServer({
    playground: true,
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        StoryResolver,
        RatingResolver
      ],
      validate: false
    }),
    context: async ({ req }) => {

      if (req.body.operationName === "IntrospectionQuery") {
        return {}
      }

      let me

      const { token } = req.headers
      if (typeof token === 'string') {
        me = await Token.verifyAndFindUser(token)
      }
  
      return {
        me,
        token,
        userLoader: createUserLoader(),
        storyLoader: createStoryLoader(),
        chapterLoader: createChapterLoader(),
        ratingLoader: createRatingLoader(),
        subscriptionLoader: createSubscriptionLoader()
      }
    }
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
