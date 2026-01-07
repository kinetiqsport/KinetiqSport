# 🚀 INSTALACIÓN Y CONFIGURACIÓN

## ⚡ Instalación (0 minutos)

Esta es una **aplicación web moderna que NO REQUIERE INSTALACIÓN**.

Solo necesitas un navegador web y abrir un archivo HTML.

---

## 📥 Cómo Acceder a la Aplicación

### Opción 1: Desde el Explorador de Archivos (Más Fácil)

**Windows:**
1. Navega a: `C:\Users\Esteban Aguilera\Desktop\Nueva carpeta\Excel\web\`
2. Haz doble clic en `index.html`
3. ¡La aplicación se abrirá en tu navegador!

**macOS:**
1. Abre Finder
2. Navega a la carpeta `web`
3. Haz doble clic en `index.html`

**Linux:**
1. Abre tu gestor de archivos
2. Navega a la carpeta `web`
3. Haz doble clic en `index.html`

### Opción 2: Desde la Línea de Comandos

**Windows (PowerShell):**
```powershell
cd "C:\Users\Esteban Aguilera\Desktop\Nueva carpeta\Excel\web"
.\index.html
# O simplemente:
start index.html
```

**Windows (CMD):**
```cmd
cd "C:\Users\Esteban Aguilera\Desktop\Nueva carpeta\Excel\web"
start index.html
```

**macOS/Linux:**
```bash
cd ~/Desktop/web
open index.html
# O en Linux:
firefox index.html
```

### Opción 3: Arrastra a tu Navegador

1. Abre tu navegador web (Chrome, Firefox, Safari, Edge)
2. Arrastra el archivo `index.html` al navegador
3. ¡Listo!

---

## 📋 Requisitos Previos

✅ **Todo lo que necesitas:**
- Un navegador web moderno
- Acceso a los archivos en tu computadora
- ¡Eso es todo!

❌ **NO necesitas:**
- Instalación de software
- Conexión a Internet
- Servidor web
- Base de datos

---

## 🎯 Archivos a Usar

### Orden recomendado de acceso:

```
1. bienvenida.html
   └─ Página de bienvenida (empezar aquí)

2. index.html
   └─ Aplicación principal

3. importar.html
   └─ Para cargar datos guardados

4. Archivos .md
   └─ Documentación (leer si necesitas ayuda)
```

---

## 🌐 Navegadores Compatibles

### ✅ Soportados
- Google Chrome 90+
- Mozilla Firefox 88+
- Apple Safari 14+
- Microsoft Edge 90+
- Opera (versión reciente)
- Navegadores móviles (iOS Safari, Chrome Mobile)

### ⚠️ Verificar versión del navegador

**Chrome/Firefox/Edge:** Clic en menú (⋮) → Ayuda → Acerca de

La versión se actualizará automáticamente si es antigua.

---

## 📁 Estructura de Carpetas Necesaria

La aplicación espera esta estructura:

```
web/
├── index.html
├── bienvenida.html
├── importar.html
├── styles.css
├── script.js
├── data.js
├── kinetiq_logo.png (opcional)
└── *.md (documentación)
```

**Importante:** Todos los archivos deben estar en la misma carpeta.

---

## 🔧 Configuración Inicial

### Sin logo (Opcional)

Si no tienes el archivo `kinetiq_logo.png`:

1. La aplicación funcionará igual sin él
2. El área del logo quedará vacía
3. Si lo obtuviste después, simplemente copia el archivo a la carpeta

### Cambiar el Logo

Para usar un logo diferente:

1. Renombra tu imagen a `kinetiq_logo.png`
2. Cópiala a la carpeta `web/`
3. Recarga la página en el navegador

### Personalizar Colores (Opcional)

Para cambiar los colores corporativos:

1. Abre `styles.css`
2. Busca la sección `:root` (línea ~8)
3. Modifica:
   ```css
   --primary-color: #003A5D;      /* Cambia este color */
   --secondary-color: #00C8D4;    /* Y este */
   ```
4. Guarda y recarga la página

---

## ✅ Verificación de Funcionamiento

### Prueba rápida después de abrir:

1. ✓ La página se carga correctamente
2. ✓ Ves un formulario con 8 secciones
3. ✓ Los botones responden al hacer clic
4. ✓ Puedes escribir en los campos
5. ✓ El botón "Cargar Ejemplo" funciona

Si algo no funciona:
- Intenta con otro navegador
- Limpia el caché (Ctrl+Shift+Delete)
- Reinicia el navegador

---

## 🌐 Hosting Opcional (Avanzado)

Si deseas hosting en línea:

### Opción 1: GitHub Pages (Gratis)
```bash
# Sube los archivos a GitHub
# Activa GitHub Pages en Configuración
# Tu app estará en: https://tu-usuario.github.io/repo-name
```

### Opción 2: Netlify (Gratis)
```bash
# Arrastra la carpeta web/ a Netlify.com
# Se asignará un dominio automáticamente
```

### Opción 3: Servidor Propio
```bash
# Copia los archivos a tu servidor web
# Accede vía: https://tu-dominio.com
```

---

## 📱 Uso en Móvil

La aplicación es 100% responsiva:

1. Abre un navegador en tu teléfono
2. Navega a la ubicación del archivo HTML
3. O sube la aplicación a un hosting
4. ¡Funciona perfectamente en teléfono!

---

## 🔒 Privacidad y Seguridad

✅ **Información importante:**
- ✓ Todo se procesa **localmente** en tu navegador
- ✓ **No** se envía información a servidores
- ✓ **No** hay tracking o analytics
- ✓ Los datos son **tuyos** siempre
- ✓ Exportación controlada por ti

---

## ⚙️ Troubleshooting

### Problema: "No puedo abrir el archivo"

**Solución:**
- Verifica que todos los archivos están en la misma carpeta
- Intenta con otro navegador
- Copia el archivo a una carpeta sin espacios en el nombre

### Problema: "El logo no aparece"

**Solución:**
- Si no tienes `kinetiq_logo.png`, ignóralo (es opcional)
- Si lo tienes, verifica que esté en la carpeta `web/`
- Recarga la página (Ctrl+R o Cmd+R)

### Problema: "No puedo guardar archivos"

**Solución:**
- Verifica que tu navegador tiene permiso para descargar archivos
- Cambiar configuración en Configuración → Descargas

### Problema: "Algunos campos no funcionan"

**Solución:**
- Abre la consola del navegador (F12)
- Busca mensajes de error
- Intenta con otro navegador

### Problema: "La página está lenta"

**Solución:**
- Limpia el caché (Ctrl+Shift+Delete)
- Cierra otras pestañas
- Reinicia el navegador

---

## 🚀 Primeros Pasos Después de Instalar

### Paso 1: Verificar funcionamiento
1. Abre `index.html`
2. Haz clic en "Cargar Ejemplo"
3. Verifica que los datos aparecen

### Paso 2: Probar guardado
1. Abre `index.html`
2. Completa algunos campos
3. Haz clic en "Guardar JSON"
4. Verifica que se descarga el archivo

### Paso 3: Probar importación
1. Abre `importar.html`
2. Carga el JSON que acabas de descargar
3. Haz clic en "Abrir en Reporte"
4. Verifica que los datos se cargan

---

## 📞 Soporte

Si necesitas ayuda:

1. **Lee primero:** `INICIO_RAPIDO.md`
2. **Consulta:** `README.md`
3. **Revisa:** Comentarios en el código
4. **Consola:** F12 para ver errores

---

## 🎉 ¡Instalación Completada!

La aplicación está lista para usar.

**Siguiente paso:** Abre `index.html` y comienza a trabajar.

---

**Versión:** 1.0  
**Última actualización:** Enero 2024  
**Empresa:** Sciencefit
