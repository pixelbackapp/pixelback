import { NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Error from 'next/error'
import { useStoryQuery } from '@/queries/useStoryQuery'
import Loader from '@/components/Loader'
import styles from './Chapters.module.scss'
import ChapterList from '@/components/ChapterList'
import Card from '@/components/Card'

interface Props {
  query: ParsedUrlQuery
}

const Chapters: NextPage<Props> = ({ query }) => {
  const getStory = useStoryQuery()
  const variables = { id: query.storyId as string }
  const result = getStory({ variables, skip: !query.storyId })

  switch (true) {
    case !!result.error:
      return <Error statusCode={404} />
    case !!result.loading:
      return <Loader />
  }

  const { story } = result.data

  return (
    <div>
      <Card>
        <ChapterList story={story} />
      </Card>
    </div>
  )
}

Chapters.getInitialProps = ({ query }) => {
  return { query }
}

export default Chapters
