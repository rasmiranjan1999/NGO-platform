import api from "../api";

export const getSettings = () =>
  api.get("/settings");

export const getActivities = () =>
  api.get("/activities");

export const getNews = () =>
  api.get("/news");

export const getRecentGallery = () =>
  api.get("/gallery/recent");

export const getAlbums = () =>
  api.get("/gallery/albums");

export const getTeam = () =>
  api.get("/team");

export const getMembers = () =>
  api.get("/members");

export const getVolunteers = () =>
  api.get("/volunteers");