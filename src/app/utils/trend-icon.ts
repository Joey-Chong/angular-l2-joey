export const getTrendIcon = (value: number) => {
  if (value < 0) return '&#129147;';
  if (value > 0) return '&#129145;';
  else return '&#8645;';
};
