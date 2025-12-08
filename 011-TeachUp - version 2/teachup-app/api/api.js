import axios from "axios";
import { Platform } from "react-native";

// Configuración de URLs según plataforma
const getBaseURL = () => {
  // Para emulador Android
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  // Para iOS o web
  return 'http://localhost:3000';
};

export const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 5000, // 5 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging de errores
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.log('⏱️ Request timeout - Backend might be down');
    } else if (error.response) {
      console.log(`❌ API Error ${error.response.status}: ${error.config.url}`);
    } else if (error.request) {
      console.log('🔌 No response from server - Is backend running?');
    }
    return Promise.reject(error);
  }
);
