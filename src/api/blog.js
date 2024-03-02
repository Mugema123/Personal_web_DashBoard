import API from './_api_';

//CREATING BLOGS
const createBlog = data => API.post('/posts/createPost', data);

//Get Single Post
const getSinglePost = slug =>
  API.get('/posts/getSinglePost?slug=' + slug);

//DELETE BLOG
const updatePost = (slug, body) =>
  API.put('/posts/updatePost?slug=' + slug, body);

//PUBLISH POST
const publishPost = async (id, isPublic) => {
  try {
    const result = await API.post(`/posts/publish/${id}`, {
      isPublic,
    });
    if (result.status === 200) {
      return { message: result.data?.message };
    }
    throw new Error('');
  } catch (error) {
    return {
      error:
        error.response?.data?.message ||
        error.response?.data?.invalidToken ||
        error.message ||
        'Unknown error has occured',
    };
  }
};

//DELETE BLOG
const deleteBlog = async id => {
  try {
    const result = await API.delete('/posts/deletePost/' + id);
    if (result.data?.deletedPost) return true;
  } catch (error) {
    // console.log(error);
    return (
      error.response?.data?.message ||
      error.response?.data?.invalidId ||
      error.response?.data?.invalidToken ||
      error.response?.data?.postDeleteError ||
      error.message ||
      'Unknown error has occured'
    );
  }
};

//Adding category
const addCategory = data => API.post('/posts/addCategory', data);
//Adding category
const deleteCategory = id =>
  API.delete('/posts/deleteCategory/' + id);
//Updating category name
const editCategory = (id, name) =>
  API.put('/posts/editCategory/' + id, { name });

export default {
  createBlog,
  deleteBlog,
  getSinglePost,
  updatePost,
  addCategory,
  deleteCategory,
  editCategory,
  publishPost,
};
