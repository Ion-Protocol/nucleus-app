export enum PointSystemKey {
  ION = 'ion',
  NUCLEUS = 'nucleus',
  SWELL = 'swell',
}

export interface PointSystem {
  key: PointSystemKey
  name: string
  pointsMultiplier: number
}
