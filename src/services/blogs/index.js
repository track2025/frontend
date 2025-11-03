import http from '../http';

export const getBlogs = async ({ limit = 10, page = 1, search = '' }) => {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('page', page.toString());
  if (search) {
    params.append('search', search);
  }

  const { data } = await http.get(`/blogs?${params.toString()}`).catch((e) => {
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
