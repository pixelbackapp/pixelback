import { useState, useEffect } from 'react'
import { useAddGenreToStoryMutation } from '@/mutations/useAddGenreToStoryMutation'
import { useCreateGenreMutation } from '@/mutations/useCreateGenreMutation'
import { useGenresQuery } from '@/queries/useGenresQuery'
import { Genre, Story } from '@/types'
import Button from '../Button'
import Input from '../Input'
import styles from './GenreSearch.module.scss'

interface Props {
  story: Story
}

const GenreSearch: React.FC<Props> = ({ story }) => {
  const [search, setSearch] = useState('')
  const [genreId, setGenreId] = useState<string | null>(null)

  const [createGenre] = useCreateGenreMutation()
  const [addGenreToStory] = useAddGenreToStoryMutation()

  const searchResult = useGenresQuery({
    variables: { search },
    skip: !search,
  })
  useEffect(() => {
    const select = document.getElementById('genre-select')
    select?.dispatchEvent(new Event('mousedown'))
  }, [searchResult.data])

  const handleSubmit = async (event: any, reset: Function) => {
    event.preventDefault()

    const variables = {
      storyId: story.id,
      genreId: genreId,
    }

    if (genreId === 'newGenre') {
      try {
        const createResult = await createGenre({
          variables: { name: search },
        })
        variables.genreId = createResult.data.createGenre.id
      } catch (err) {
        console.warn(err)
        reset()
        return
      }
    }

    try {
      await addGenreToStory({ variables })
    } catch (err) {
      console.warn(err)
    }

    reset()
  }

  // useEffect(() => {
  //   if (!createdGenre.data) return
  //   const variables = {
  //     storyId: story.id,
  //     genreId: createdGenre.data.id
  //   }
  //   addGenreToStory({ variables })
  // }, [createdGenre])

  const renderSearchResults = () => {
    if (searchResult.loading) return null

    if (!searchResult.data?.genres.length) {
      if (genreId !== 'newGenre') setGenreId('newGenre')
      return null
    }

    return searchResult.data.genres.map((genre: Genre) => {
      return (
        <option key={genre.id} value={genre.id}>
          {genre.name}
        </option>
      )
    })
  }

  const renderAddOption = () => {
    if (!search || searchResult.data?.genres.length) return null

    return <option value="newGenre">Add "{search}" as a genre</option>
  }

  return (
    <>
      <Input
        name="search"
        value={search}
        onChange={(event: any) => setSearch(event.target.value)}
      />
      <select
        id="genre-select"
        onChange={(event: any) => setGenreId(event.target.value)}
        className={styles.select}
        disabled={!search}
      >
        <option>Select a genre</option>
        {renderSearchResults()}
        {renderAddOption()}
      </select>
      <Button onClick={handleSubmit}>Add Genre</Button>
    </>
  )
}

export default GenreSearch