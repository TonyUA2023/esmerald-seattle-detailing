export interface Location {
  state: string;
  stateName: string;
  city: string;
  cityName: string;
}

export const locations: Location[] = [
  { state: 'wa', stateName: 'Washington', city: 'seattle', cityName: 'Seattle' },
  { state: 'wa', stateName: 'Washington', city: 'bellevue', cityName: 'Bellevue' },
  { state: 'wa', stateName: 'Washington', city: 'kirkland', cityName: 'Kirkland' },
  { state: 'wa', stateName: 'Washington', city: 'redmond', cityName: 'Redmond' },
  { state: 'wa', stateName: 'Washington', city: 'renton', cityName: 'Renton' },
  { state: 'wa', stateName: 'Washington', city: 'tacoma', cityName: 'Tacoma' },
  // Agrega más ciudades y estados aquí para expandir tu cobertura SEO a nivel nacional
];
