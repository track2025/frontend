import http from '../http';

export const getBlogs = async ({ limit = 10, page = 1 }) => {
  const { data } = await http.get(`/blogs?limit=${limit}&page=${page}`).catch((e) => {
    throw e;
  });
  return data;
};

export const getBlogBySlug = async (slug) => {
  const { data } = await http.get(`/blogs/${slug}`).catch((e) => {
    throw e;
  });
  return data;
};
