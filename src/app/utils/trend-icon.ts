export const getTrendIcon = (value: number) => {
  if (value < 0) return '🡻';
  if (value > 0) return '🡹';
  else return '⥮';
}