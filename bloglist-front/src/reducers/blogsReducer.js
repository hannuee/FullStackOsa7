import blogsService from '../services/blogs'
import { changeNotification } from './notificationReducer'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'NEW_BLOG':
    return state.concat(action.data).sort((a, b) => b.likes - a.likes)
  case 'INIT_BLOGS':
    return action.data
  default: return state
  }
}

export const createBlog = (blog, blogFormToggleRef, blogFormEmptyRef) => {
  return async dispatch => {
    try {
      const newBlog = await blogsService.create(blog)
      dispatch({
        type: 'NEW_BLOG',
        data: newBlog
      })

      blogFormToggleRef.current.toggleVisibility()
      dispatch(changeNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, 'success', 5))
      blogFormEmptyRef.current.emptyForm()
    } catch (exception) {
      if (exception.response) {
        dispatch(changeNotification(exception.response.data.error, 'error', 5))
      }
    }
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogsService.getAll()
    blogs.sort((a, b) => b.likes - a.likes)
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export default reducer
