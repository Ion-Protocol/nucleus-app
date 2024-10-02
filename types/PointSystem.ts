export enum PointSystemKey {
  ION = 'ion',
  NUCLEUS = 'nucleus',
  SWELL = 'swell',
  FORM = 'form',
  RENZO = 'renzo', // ezPoints
  EIGENLAYER = 'eigenlayer',
  SYMBIOTIC = 'symbiotic',
  MELLOW = 'mellow',
}

export interface PointSystem {
  key: PointSystemKey
  name: string
  pointsMultiplier: number
}
