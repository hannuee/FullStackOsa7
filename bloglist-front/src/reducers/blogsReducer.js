import blogsService from '../services/blogs'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'NEW_BLOG':
    return state.concat(action.data)
  case 'INIT_BLOGS':
    return action.data
  default: return state
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogsService.create(blog)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogsService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export default reducer
