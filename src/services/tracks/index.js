import http from '../http';

export const getTracks = async ({ limit = 12, page = 1 }) => {
  const { data } = await http.get(`/tracks?limit=${limit}&page=${page}`).catch((e) => {
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
