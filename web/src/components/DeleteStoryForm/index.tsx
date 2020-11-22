import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import styles from './DeleteStoryForm.module.scss'
import userContext from '../../context/userContext'
import { useDeleteStoryMutation } from '../../hooks/useDeleteStoryMutation'
import Input from '../Input'
import Button from '../Button'
import { Story } from '../../types'

interface Props {
  story: Story
}

const DeleteStoryForm: React.FC<Props> = ({ story }) => {

  const [title, setTitle] = useState('')
  const [deleteStory] = useDeleteStoryMutation()
  const { push } = useRouter()
  const { currentUser, setCurrentUser } = useContext(userContext)

  if (!currentUser) return null

  const onDeleteClick = async (event: any, reset: Function) => {
    event.preventDefault()
    if (title !== story.title) {
      window.alert('The text in the input needs to match the title of the story exactly.')
      reset()
      return
    }

    const confirm = window.confirm(`Are you sure you want to permanently delete ${story.title}? Doing so will delete all chapters, comments, and ratings related to the story.`)
    if (confirm) {
      await deleteStory({ variables: { id: story.id } })
      setCurrentUser({
        ...currentUser,
        stories: currentUser.stories.filter(s => s.id !== story.id)
      })
      push('/writer-dashboard')
    }

    reset()
  }

  return (
    <form className={styles.form}>
      <h3>Delete this story</h3>
      <p>In order to delete the story, please enter <strong>{story.title}</strong> into the input.</p>
      <Input
        name="title"
        value={title}
        onChange={(event: any) => setTitle(event.target.value)}
      />
      <Button
        type="submit"
        styleTypes={['delete']}
        onClick={onDeleteClick}
      >
        Delete
      </Button>
    </form>
  )
}

export default DeleteStoryForm
