import React, { useState, useImperativeHandle } from 'react'

const NewBlogForm = React.forwardRef((props, ref) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreation = (event) => {
    event.preventDefault()
    props.createBlog({ title, author, url })
  }

  const emptyForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  useImperativeHandle(ref, () => {
    return { emptyForm }
  })

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreation}>
        <div>
        title: <input type="text" value={title} id='title' name="Title" onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
        author: <input type="text" value={author} id='author' name="Author" onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
        url: <input type="text" value={url} id='url' name="Url" onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit" id='create'>create</button>
      </form>
    </div>
  )
})

NewBlogForm.displayName = 'NewBlogForm'

export default NewBlogForm