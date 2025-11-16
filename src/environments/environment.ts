import { environmentDefault } from "./default";

export const environment = {
    ...environmentDefault,
    production: false,
    backend: 'https://vertexweb.lat/api', // Asegúrate que coincida con tu basePath en Nest
    jwtKey: 'jwtToken' // Key para localStorage
  };