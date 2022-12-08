export const getTrendIcon = (value: number): string => {
  if (value < 0) return '&#129147;';
  if (value > 0) return '&#129145;';
  else return '&#8645;';
};
