# Lab 5 - UNA Chat - Evidencias y Resultados

## Objetivos Completados ✅

### 1. ✅ Ejecutar y comprender el funcionamiento del proyecto UNA Chat
- **Estado**: ✅ COMPLETADO
- **Evidencia**: Servidor ejecutándose en puerto 3001
- **Comando**: `npm start`
- **Resultado**: `listening on *:3001`

### 2. ✅ Identificar y solucionar vulnerabilidades de inyección de scripts
- **Estado**: ✅ COMPLETADO
- **Problema identificado**: El código original usaba `.html()` sin sanitización
- **Solución implementada**: 
  - Función `containsScriptInjection()` para detectar scripts maliciosos
  - Función `sanitizeText()` para escapar caracteres HTML peligrosos
  - Validación en `validateMessage()` que bloquea intentos de inyección

### 3. ✅ Implementar funcionalidad para agregar y visualizar URLs de videos e imágenes
- **Estado**: ✅ COMPLETADO
- **Funcionalidades añadidas**:
  - Soporte para imágenes: JPG, JPEG, GIF, PNG, BMP, WEBP
  - Soporte para videos de YouTube: formato completo y youtu.be
  - Soporte para videos de Vimeo
  - Soporte para videos directos: MP4, WEBM, OGG, AVI, MOV

### 4. ✅ Mejorar la validación de mensajes para prevenir inyecciones de scripts
- **Estado**: ✅ COMPLETADO
- **Implementaciones**:
  - Detección de tags `<script>`
  - Detección de protocolo `javascript:`
  - Detección de event handlers (`onclick`, `onload`, etc.)
  - Detección de iframes maliciosos
  - Bloqueo de funciones peligrosas (`eval`, `alert`, etc.)

### 5. ✅ Mejorar la validación de URLs para permitir contenido multimedia seguro
- **Estado**: ✅ COMPLETADO
- **Mejoras implementadas**:
  - Expresiones regulares más estrictas para URLs
  - Validación anti-XSS en todas las funciones de URL
  - Soporte para múltiples formatos de video e imagen

### 6. ✅ Realizar pruebas unitarias para validar URLs de imágenes y videos
- **Estado**: ✅ COMPLETADO
- **Resultado**: **26 pruebas pasando ✅**

## Pruebas de Seguridad Realizadas

### Pruebas Anti-XSS:
```javascript
// Test 1: Script tags
assert.equal(val.containsScriptInjection('<script>alert("hack")</script>'), true);

// Test 2: JavaScript protocol
assert.equal(val.containsScriptInjection('javascript:alert("hack")'), true);

// Test 3: Event handlers
assert.equal(val.containsScriptInjection('onclick=alert("hack")'), true);

// Test 4: Malicious iframes
assert.equal(val.containsScriptInjection('<iframe src="javascript:alert()"></iframe>'), true);
```

### Pruebas de Validación de URLs:
```javascript
// URLs de imágenes válidas
assert.equal(val.is_valid_url_image('https://example.com/photo.png'), true);

// URLs de videos válidas
assert.equal(val.is_valid_yt_video('https://www.youtube.com/watch?v=qYwlqx-JLok'), true);
assert.equal(val.is_valid_vimeo_video('https://vimeo.com/123456789'), true);

// URLs con scripts (deben ser rechazadas)
assert.equal(val.is_valid_url_image('http://image.com/image.jpg<script>alert("hack")</script>'), false);
```

## Funciones de Seguridad Implementadas

### 1. `containsScriptInjection(text)`
- Detecta intentos de inyección de scripts
- Patrones detectados: script tags, javascript:, event handlers, iframes maliciosos

### 2. `sanitizeText(text)`
- Escapa caracteres HTML peligrosos
- Convierte `<`, `>`, `"`, `'`, `&`, `/` a sus entidades HTML

### 3. `validateMessage(msg)`
- Valida y procesa mensajes del chat
- Bloquea inyecciones de scripts
- Procesa URLs de imágenes y videos de forma segura
- Sanitiza texto normal

## Archivos Modificados

### `libs/unalib.js`
- ✅ Corregidos errores en `is_valid_url_image` y `is_valid_yt_video`
- ✅ Añadidas funciones de seguridad anti-XSS
- ✅ Añadido soporte para múltiples plataformas de video
- ✅ Mejoradas expresiones regulares para URLs

### `test/test.js`
- ✅ Añadidas 26 pruebas unitarias
- ✅ Pruebas de seguridad anti-XSS
- ✅ Pruebas de validación de URLs
- ✅ Pruebas de sanitización de texto

### `server.js`
- ✅ Configurado para usar puerto 3001
- ✅ Integración con funciones de validación mejoradas

## Cómo Probar las Funcionalidades

### 1. Probar Inyección de Scripts (Debe ser bloqueado):
```
Mensaje malicioso: <script>alert('hack')</script>
Resultado esperado: ⚠️ Mensaje bloqueado: Intento de inyección de script detectado
```

### 2. Probar URL de Imagen:
```
Mensaje: https://via.placeholder.com/300.jpg
Resultado esperado: Imagen mostrada en el chat
```

### 3. Probar URL de Video de YouTube:
```
Mensaje: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Resultado esperado: Reproductor de YouTube embebido
```

### 4. Probar URL de Video de Vimeo:
```
Mensaje: https://vimeo.com/123456789
Resultado esperado: Reproductor de Vimeo embebido
```

## Comandos para Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar pruebas
npm test
# O alternativamente
npx mocha test/test.js

# Ejecutar servidor
npm start
```

## Acceso a la Aplicación
- **URL**: http://localhost:3001
- **Puerto**: 3001
- **Estado**: ✅ Funcionando correctamente

## Resumen de Seguridad
- ✅ **XSS Prevention**: Implementado
- ✅ **Script Injection Detection**: Implementado  
- ✅ **URL Validation**: Mejorado y securizado
- ✅ **Input Sanitization**: Implementado
- ✅ **Test Coverage**: 26 pruebas pasando (100% exitosas)

---
**Fecha**: 24 de Septiembre, 2025  
**Estado**: ✅ LABORATORIO COMPLETADO EXITOSAMENTE