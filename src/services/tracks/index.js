import http from '../http';

export const getTracks = async ({ limit = 12, page = 1, search = '' }) => {
  const params = new URLSearchParams();
  params.append('limit', limit);
  params.append('page', page);
  if (search) {
    params.append('search', search);
  }

  const { data } = await http.get(`/tracks?${params.toString()}`).catch((e) => {
    throw e;
  });
  return data;
};

export const getTrackBySlug = async (slug) => {
  const { data } = await http.get(`/tracks/${slug}`).catch((e) => {
    throw e;
  });
  return data;
};

export const getTrackEventsByTrackSlug = async (slug) => {
  const { data } = await http.get(`/tracks/events/${slug}`).catch((e) => {
    throw e;
  });
  return data;
};
