import { NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Error from 'next/error'
import { useStoryQuery } from '@/queries/useStoryQuery'
import Loader from '@/components/Loader'
import styles from './Chapters.module.scss'
import ChapterList from '@/components/ChapterList'
import Card from '@/components/Card'
import { withApollo } from '@/utils/withApollo'

interface Props {
  query: ParsedUrlQuery
}

const Chapters: NextPage<Props> = ({ query }) => {
  const variables = { id: query.storyId as string }
  const result = useStoryQuery({ variables, skip: !query.storyId })

  switch (true) {
    case !!result.error:
      return <Error statusCode={404} />
    case result.loading:
      return <Loader />
  }

  const { story } = result.data

  return (
    <div>
      <h2>{story.title}</h2>
      {story.summary}
      <Card>
        <ChapterList story={story} />
      </Card>
    </div>
  )
}

Chapters.getInitialProps = ({ query }) => {
  return { query }
}

export default withApollo({ ssr: true })(Chapters as any)
