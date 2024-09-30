export enum PointSystemKey {
  ION = 'ion',
  NUCLEUS = 'nucleus',
  SWELL = 'swell',
  FORM = 'form',
}

export interface PointSystem {
  key: PointSystemKey
  name: string
  pointsMultiplier: number
}
