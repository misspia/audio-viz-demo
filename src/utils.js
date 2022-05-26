export const remap = (min1, max1, min2, max2, value) => (
  min2 + (max2 - min2) * (value - min1) / (max1 - min1)
)

export const remapFreq = (min, max, value) => (
  remap(0, 255, min, max, value)
)
