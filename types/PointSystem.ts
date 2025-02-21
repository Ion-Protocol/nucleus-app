export enum PointSystemKey {
  ION = 'ion',
  NUCLEUS = 'nucleus',
  SWELL = 'swell',
  FORM = 'form',
  RENZO = 'renzo', // ezPoints
  EIGENLAYER = 'eigenlayer',
  SYMBIOTIC = 'symbiotic',
  MELLOW = 'mellow',
  PUMPBTC = 'pumpbtc',
  SOLVBTC = 'solvbtc',
  BABYLON = 'babylon',
  FIREBTC = 'firebtc',
  LORENZOSTBTC = 'lorenzostbtc',
  CARROTS = 'carrots',
  GRASS = 'grass',
  WSWELL = 'wswell',
}

export interface PointSystem {
  key: PointSystemKey
  name: string
  pointsMultiplier: number
}
