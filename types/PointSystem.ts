export enum PointSystemKey {
  ION = 'ion',
  NUCLEUS = 'nucleus',
}

export interface PointSystem {
  key: PointSystemKey
  name: string
  pointsMultiplier: number
}
