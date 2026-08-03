export const toFullUrl = (relativePath: string): string => {
  return `http://localhost:3000${relativePath}`;
};

export const withFullPhotoUrl = <T extends { url: string }>(photo: T) => ({
  ...photo,
  url: toFullUrl(photo.url),
});