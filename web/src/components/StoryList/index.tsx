import Link from 'next/link'
import Card from '@/components/Card'
import { Story } from '@/types'
import styles from './StoryList.module.scss'
import StarScale from '../StarScale'

interface Props {
  stories: Story[]
}

const StoryList: React.FC<Props> = ({ stories }) => {
  const renderRating = (story: Story) => {
    if (story.ratings.length < 5) return null

    // return <p>Rated {story.score}/5</p>
    return <StarScale small score={story.score} />
  }

  const renderStories = () => {
    return stories.map((story: Story) => {
      return (
        <Card key={story.id}>
          <div className={styles.storyHeader}>
            <Link href={`/stories/${story.id}`}>
              <h3>{story.title}</h3>
            </Link>
            {renderRating(story)}
          </div>
          {story.summary}
          <p>By {story.author.penName}</p>
          <Link href={`/stories/${story.id}`}>
            <a>Read</a>
          </Link>
        </Card>
      )
    })
  }

  return <>{renderStories()}</>
}

export default StoryList
