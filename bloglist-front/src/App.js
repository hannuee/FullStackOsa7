import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { changeNotification } from './reducers/notificationReducer'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()
  const message = useSelector(state => state.notification)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }

    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password, })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')

      dispatch(changeNotification('Login success', 'success', 5))
    } catch (exception) {
      if (exception.response) {
        dispatch(changeNotification(exception.response.data.error, 'error', 5))
      }
    }
  }

  const blogFormRef = useRef()

  const handleCreation = async (blogObject) => {
    try {
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response).sort((a, b) => b.likes - a.likes))

      blogFormRef.current.toggleVisibility()

      dispatch(changeNotification(`a new blog ${response.title} by ${response.author} added`, 'success', 5))
      return true
    } catch (exception) {
      if (exception.response) {
        dispatch(changeNotification(exception.response.data.error, 'error', 5))
      }
      return false
    }
  }

  const handleUpdate = async (originalBlog, updatedBlog) => {
    try {
      const response = await blogService.update(originalBlog.id, updatedBlog)
      response.user = originalBlog.user
      setBlogs(blogs.filter(blog => blog.id !== response.id).concat(response).sort((a, b) => b.likes - a.likes))

      dispatch(changeNotification(`blog ${response.title} by ${response.author} got 1 like more`, 'success', 5))
      return true
    } catch (exception) {
      if (exception.response) {
        dispatch(changeNotification(exception.response.data.error, 'error', 5))
      }
      return false
    }
  }

  const handleDeletion = async (deletedBlog) => {
    try {
      await blogService.deletion(deletedBlog.id)
      setBlogs(blogs.filter(blog => blog.id !== deletedBlog.id).sort((a, b) => b.likes - a.likes))

      dispatch(changeNotification(`blog ${deletedBlog.title} by ${deletedBlog.author} deleted`, 'success', 5))
      return true
    } catch (exception) {
      if (exception.response) {
        dispatch(changeNotification(exception.response.data.error, 'error', 5))
      }
      return false
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    blogService.setToken(null)
  }

  const Notification = (message) => {
    if (message.text === null) {
      return null
    }

    return (
      <div className={message.styleName}>
        {message.text}
      </div>
    )
  }

  if (user === null) return (
    <div>
      <h2>Log in to application</h2>
      {Notification(message)}
      <form onSubmit={handleLogin}>
        <div>
          username <input type="text" value={username} id="username" name="Username" onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password <input type="password" value={password} id="password" name="Password" onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit" id="login">login</button>
      </form>
    </div>
  )

  return (
    <div>
      <h2>blogs</h2>
      {Notification(message)}
      <p>{user.name} logged in <button onClick={() => logout()}>Logout</button></p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <NewBlogForm
          createBlog={handleCreation}
        />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleUpdate={handleUpdate} handleDeletion={handleDeletion} loggedUser={user} />
      )}
    </div>
  )
}

export default App