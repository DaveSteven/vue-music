export function calculateSize(size) {
  const DESIGN_WIDTH = 750;
  const deviceWidth = document.body.clientWidth;
  return size / (DESIGN_WIDTH / 100) * (deviceWidth / 100);
}