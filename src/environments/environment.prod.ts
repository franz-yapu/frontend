import { environmentDefault } from './default';

export const environment = {
  ...environmentDefault,
  production: true,
  backend: 'https://vertexweb.lat/api/',  
  Socket: 'https://vertexweb.lat',      
  jwtKey: 'jwtToken'
};