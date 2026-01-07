# 📋 Reporte Médico - Versión Web

Migración moderna de plantilla de Excel a una aplicación web interactiva, profesional y responsiva para análisis de pisada y presiones plantares.

## 🎯 Características Principales

✅ **Diseño Moderno y Profesional**
- Interfaz intuitiva con colores corporativos (Azul oscuro #003A5D, Turquesa #00C8D4)
- Completamente responsivo (funciona en desktop, tablet y móvil)
- Animaciones suaves y transiciones elegantes

✅ **Funcionalidades Completas**
- Cálculo automático de IMC
- Validación en tiempo real de campos
- Tabla interactiva de tests de salto
- Múltiples secciones organizadas

✅ **Gestión de Datos**
- Cargar datos de ejemplo con un clic
- Guardar reporte como archivo JSON
- Imprimir o exportar a PDF
- Almacenamiento y recuperación de datos

✅ **Accesibilidad**
- Interfaz amigable y clara
- Etiquetas descriptivas en todos los campos
- Navegación intuitiva

## 📁 Estructura de Archivos

```
web/
├── index.html          # Estructura HTML completa
├── styles.css          # Estilos CSS modernos y responsivos
├── script.js           # Lógica JavaScript (validaciones, cálculos)
├── data.js             # Datos de ejemplo
└── README.md           # Este archivo
```

## 🚀 Cómo Usar

### 1. **Abrir el Reporte**
   - Abre `index.html` en tu navegador web
   - La página se cargará con una interfaz profesional y lista para usar

### 2. **Completar el Formulario**
   - Completa los campos manualmente
   - Algunos campos tienen validación automática:
     - **Edad**: 0-120 años
     - **Peso**: 20-300 kg
     - **Talla**: 50-250 cm
     - **Celular**: 10 dígitos
     - **IMC**: Se calcula automáticamente

### 3. **Cargar Datos de Ejemplo**
   - Haz clic en el botón "📋 Cargar Ejemplo"
   - Se llenarán todos los campos con datos de un atleta de fútbol
   - Útil para ver cómo se ve el reporte completo

### 4. **Guardar el Reporte**
   - Haz clic en "💾 Guardar JSON"
   - Se descargará un archivo JSON con todos los datos
   - Formato: `reporte_[nombre]_[apellido]_[timestamp].json`

### 5. **Imprimir o Exportar a PDF**
   - Haz clic en "🖨️ Imprimir / PDF"
   - Se abrirá el diálogo de impresión del navegador
   - Desde el navegador puedes guardar como PDF

## 📝 Secciones del Reporte

### 1. **Datos Generales**
   - Información personal del paciente
   - Cálculo automático de IMC

### 2. **Anamnesis y Antecedentes Clínicos**
   - Historial médico completo
   - Antecedentes quirúrgicos y traumáticos
   - Alergias y hospitalizaciones

### 3. **Actividad Física y Entrenamiento**
   - Deporte practicado
   - Información del club y entrenador
   - Frecuencia de entrenamiento

### 4. **Motivo de Consulta**
   - Descripción principal del problema
   - Notas adicionales relevantes

### 5. **Valoración Fisioterapia Deportiva**
   - Evaluación postural y de marcha
   - Tests especiales (HODS, Lunge)
   - Observaciones clínicas

### 6. **Tests de Salto**
   - Tabla de datos con múltiples tipos de saltos
   - Métricas: Peso, Altura, Velocidad, Tiempo de Vuelo, etc.

### 7. **Dinamometría**
   - Mediciones de fuerza muscular

### 8. **Velocidad y Goniometría**
   - Datos de velocidad y rangos de movimiento

## 🎨 Personalización

### Cambiar Colores
En `styles.css`, busca las variables CSS y modifica:
```css
--primary-color: #003A5D;      /* Azul oscuro */
--secondary-color: #00C8D4;    /* Turquesa */
```

### Agregar Nuevos Campos
1. En `index.html`: Añade un nuevo campo `<input>` o `<textarea>` con un `id` único
2. En `script.js`: El campo se incluirá automáticamente en la exportación JSON

### Cambiar Datos de Ejemplo
Edita el objeto `exampleData` en `data.js` con los datos que desees

## 💡 Validaciones Automáticas

| Campo | Validación |
|-------|-----------|
| Edad | Entre 0 y 120 años |
| Peso | Entre 20 y 300 kg |
| Talla | Entre 50 y 250 cm |
| Celular | Exactamente 10 dígitos |
| IMC | Cálculo automático (Peso / Talla²) |
| Sexo | Lista desplegable cerrada |
| Dominancia | Lista desplegable cerrada |

## 🖥️ Compatibilidad

- ✅ Chrome (versión 90+)
- ✅ Firefox (versión 88+)
- ✅ Safari (versión 14+)
- ✅ Edge (versión 90+)
- ✅ Navegadores móviles (iOS Safari, Chrome Mobile)

## 📱 Responsive Design

La aplicación se adapta automáticamente a diferentes tamaños de pantalla:
- **Desktop**: Layout de 2-4 columnas
- **Tablet**: Layout de 2 columnas
- **Móvil**: Layout de 1 columna

## 🔒 Seguridad y Privacidad

- ✅ Todos los datos se procesan localmente en tu navegador
- ✅ No se envía información a servidores externos
- ✅ Los datos se guardan solo cuando el usuario lo decide

## 📊 Exportación de Datos

### Formato JSON
```json
{
  "nombre": "Carlos Eduardo",
  "apellido": "Rodríguez Pérez",
  "edad": 24,
  "peso": 73.5,
  "talla": 178.2,
  "saltos": {
    "cmj": {
      "peso": "73.5",
      "altura": "42.3",
      ...
    }
  },
  "fecha": "2024-01-07T15:30:00.000Z"
}
```

## 🔧 Desarrollo y Extensión

### Dependencias
- Sin dependencias externas (Vanilla JavaScript)
- Compatible con cualquier servidor web

### Funciones Principales (script.js)

```javascript
// Instancia principal
const reporte = new ReporteMedico();

// Métodos disponibles
reporte.calculateIMC();        // Calcula IMC automáticamente
reporte.validateNumber();      // Valida campos numéricos
reporte.loadExampleData();     // Carga datos de ejemplo
reporte.saveAsJSON();          // Exporta a JSON
reporte.printReport();         // Abre diálogo de impresión
```

## 🚀 Mejoras Futuras Posibles

- 📈 Gráficos de progreso del paciente
- 📧 Envío de reporte por correo
- 🗄️ Base de datos para almacenamiento
- 🔐 Autenticación de usuarios
- 📱 Aplicación móvil nativa
- 🌙 Modo oscuro
- 🌐 Soporte multiidioma

## 📞 Soporte

Para preguntas o sugerencias, contacta al equipo de desarrollo.

---

**Versión**: 1.0
**Última actualización**: Enero 2024
**Empresa**: Sciencefit
**Estado**: ✅ Producción

