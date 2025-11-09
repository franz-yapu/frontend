import { environmentDefault } from "./default";

export const environment = {
    ...environmentDefault,
    production: false,
    backend: 'http://localhost:3001/api', // Asegúrate que coincida con tu basePath en Nest
    jwtKey: 'jwtToken' // Key para localStorage
  };