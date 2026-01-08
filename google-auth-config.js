// Configuración de Google OAuth
// Se inyecta desde GitHub Secrets en el deploy

// En producción, se inyecta desde GitHub Actions
// En desarrollo local, reemplaza esto con tu Google Client ID
window.GOOGLE_CLIENT_ID = window.GOOGLE_CLIENT_ID || '1042371491410-bkkfij37r2csku7cl6baaaca7vdd94sn.apps.googleusercontent.com';

console.log('Google Auth Config loaded');
