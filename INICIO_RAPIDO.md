# 🚀 GUÍA DE INICIO RÁPIDO

## ⚡ Inicio en 30 segundos

### 1️⃣ Abre la aplicación
```
Haz doble clic en → index.html
```
Se abrirá en tu navegador web predeterminado.

### 2️⃣ Completa los datos
- Ingresa los datos del paciente
- El **IMC** se calcula automáticamente
- Todos los campos tienen validación en tiempo real

### 3️⃣ Carga un ejemplo (Opcional)
Haz clic en **"📋 Cargar Ejemplo"** para ver cómo se ve completo.

### 4️⃣ Guarda o Imprime
- **💾 Guardar JSON** → Descarga los datos como archivo JSON
- **🖨️ Imprimir / PDF** → Exporta a PDF

---

## 📁 Archivos Principales

| Archivo | Función |
|---------|---------|
| `index.html` | 🎯 Aplicación principal - Abre este archivo |
| `styles.css` | 🎨 Estilos y diseño profesional |
| `script.js` | ⚙️ Funcionalidad (validaciones, cálculos) |
| `data.js` | 📊 Datos de ejemplo |
| `importar.html` | 📥 Herramienta para importar JSON |
| `README.md` | 📖 Documentación completa |

---

## 🎯 Tareas Principales

### ✏️ Escribir un nuevo reporte
1. Abre `index.html`
2. Completa los campos
3. Haz clic en **"💾 Guardar JSON"** para descargar

### 📥 Cargar un reporte guardado
1. Abre `importar.html`
2. Arrastra el archivo JSON o selecciónalo
3. Haz clic en **"↗️ Abrir en Reporte"**
4. Los datos se cargarán automáticamente

### 🖨️ Imprimir o Exportar a PDF
1. Completa el reporte
2. Haz clic en **"🖨️ Imprimir / PDF"**
3. En el diálogo: Selecciona "Guardar como PDF"
4. ✓ Listo

### 📋 Cargar datos de ejemplo
1. Abre `index.html`
2. Haz clic en **"📋 Cargar Ejemplo"**
3. ✓ Se llenarán todos los campos automáticamente

---

## 🎨 Secciones del Formulario

```
📋 DATOS GENERALES
   └─ Nombre, Edad, Peso, Talla, etc.

📝 ANAMNESIS
   └─ Historial médico y antecedentes

🏃 ACTIVIDAD FÍSICA
   └─ Deporte, Club, Entrenamiento

❓ MOTIVO DE CONSULTA
   └─ Razón principal de la consulta

🔍 VALORACIÓN FISIOTERAPIA
   └─ Postura, Marcha, HODS, Lunge

📊 TESTS DE SALTO
   └─ CMJ, SJ, DJ, Abralakov, etc.

💪 DINAMOMETRÍA
   └─ Mediciones de fuerza

📐 VELOCIDAD Y GONIOMETRÍA
   └─ Mediciones de velocidad y ángulos
```

---

## 💡 Consejos Útiles

### 🔢 Validaciones Automáticas
- **Edad**: 0-120 años
- **Peso**: 20-300 kg
- **Talla**: 50-250 cm
- **Celular**: 10 dígitos exactos
- **IMC**: Se calcula automáticamente como Peso/(Talla/100)²

### 💾 Guardar Datos
```json
📊 Formato JSON exportado:
{
  "nombre": "Carlos",
  "apellido": "Rodríguez",
  "edad": 24,
  "peso": 73.5,
  "talla": 178.2,
  "saltos": { ... },
  "fecha": "2024-01-07T15:30:00Z"
}
```

### 🌐 Compatibilidad
✅ Chrome, Firefox, Safari, Edge
✅ Desktop, Tablet, Móvil
✅ Windows, macOS, Linux

---

## ❓ Preguntas Frecuentes

### ¿Necesito internet?
❌ **No**. Todo funciona offline en tu navegador.

### ¿Dónde se guardan los datos?
📁 **Localmente**. En tu computadora cuando descargas JSON.

### ¿Es seguro?
✅ **Sí**. No se envía información a servidores externos.

### ¿Cómo exporto a Excel?
1. Guarda como JSON
2. Usa una herramienta JSON→Excel
3. O copia/pega los datos manualmente

### ¿Puedo editar después?
✅ **Sí**. Abre `importar.html` y carga el JSON guardado.

---

## 🔧 Requisitos Técnicos

- ✅ Navegador web moderno (Chrome, Firefox, Safari, Edge)
- ✅ Sin dependencias externas
- ✅ No requiere instalación
- ✅ Funciona offline

---

## 🚨 Solucionar Problemas

### La aplicación no se carga
1. Verifica que `index.html` esté en la carpeta correcta
2. Intenta con otro navegador
3. Revisa la consola del navegador (F12)

### Los datos no se guardan
1. Usa el botón **"💾 Guardar JSON"** para descargar
2. Verifica los permisos de descarga del navegador

### El logo no aparece
1. Asegúrate que `kinetiq_logo.png` esté en la misma carpeta
2. Si no lo tienes, puedes comentar la línea en HTML (no es obligatorio)

### La impresión no funciona
1. Intenta con Ctrl+P o Cmd+P
2. Selecciona "Guardar como PDF" como impresora
3. Ajusta márgenes si es necesario

---

## 📞 Soporte

Para problemas o sugerencias, revisa:
- 📖 README.md (documentación completa)
- 💬 Los comentarios en el código
- 🐛 Errores en la consola del navegador (F12)

---

## 🎓 Próximos Pasos

1. **Experimenta**: Carga el ejemplo y explora
2. **Personaliza**: Modifica los campos según necesites
3. **Integra**: Usa el JSON exportado en tus sistemas
4. **Comparte**: Envía reportes en PDF a colegas

---

**¡Listo para usar! 🎉**

Abre `index.html` y comienza ahora mismo.

