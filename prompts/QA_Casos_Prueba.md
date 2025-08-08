# Casos de Prueba para Unosquare Sports Store

A continuación se listan los casos de prueba diseñados para la aplicación, indicando si están automatizados (Playwright) o solo documentados/manuales.

## 1. Casos de Prueba Automatizados

### Login
- **Login con usuario y contraseña incorrectos** (**Automatizado**)
  - Steps:
    1. Abrir la app.
    2. Ingresar usuario y contraseña inválidos.
    3. Click en Login.
  - Expected: Se muestra mensaje de error "Username and password do not match..."
- **Login con campos vacíos** (**Automatizado**)
  - Steps:
    1. Abrir la app.
    2. Dejar usuario y contraseña vacíos.
    3. Click en Login.
  - Expected: Se muestra mensaje de error de campos requeridos.
- **Login con usuario "unosquare_errorUser" (error especial)** (**Automatizado**)
  - Steps:
    1. Abrir la app.
    2. Ingresar usuario "unosquare_errorUser" y contraseña "secret_uno".
    3. Click en Login.
  - Expected: Se muestra mensaje de error especial "Epic Error..."
- **Login con usuario "unosquare_performanceUser" (loading 10s)** (**Automatizado**)
  - Steps:
    1. Abrir la app.
    2. Ingresar usuario "unosquare_performanceUser" y contraseña "secret_uno".
    3. Click en Login.
  - Expected: Se muestra pantalla de loading por 10 segundos y luego acceso.

### Carrito
- **No permite checkout con carrito vacío** (**Automatizado**)
  - Steps:
    1. Iniciar sesión.
    2. Ir al carrito sin agregar productos.
  - Expected: Botón de checkout deshabilitado.
- **No permite checkout con total negativo** (**Automatizado**)
  - Steps:
    1. Iniciar sesión.
    2. Agregar producto con precio negativo.
    3. Ir al carrito.
  - Expected: Botón de checkout deshabilitado y mensaje de advertencia.
- **Persistencia del carrito tras recargar la página** (**Automatizado**)
  - Steps:
    1. Iniciar sesión.
    2. Agregar producto al carrito.
    3. Recargar la página.
    4. Ir al carrito.
  - Expected: El producto sigue en el carrito.
- **Agregar producto al carrito** (**Automatizado**)
  - Steps:
    1. Iniciar sesión.
    2. Agregar producto desde inventario.
    3. Ir al carrito.
  - Expected: El producto aparece en el carrito.
- **Eliminar producto del carrito** (**Automatizado**)
  - Steps:
    1. Iniciar sesión.
    2. Agregar producto al carrito.
    3. Eliminar producto desde el carrito.
  - Expected: El producto ya no aparece en el carrito.

### Checkout
- **Checkout con zip code inválido** (**Automatizado**)
  - Steps:
    1. Iniciar sesión y agregar producto al carrito.
    2. Ir a checkout.
    3. Ingresar zip code inválido.
    4. Completar el resto de campos válidos.
    5. Click en continuar.
  - Expected: Se muestra mensaje de error de zip code.
- **Checkout con número de tarjeta inválido** (**Automatizado**)
  - Steps:
    1. Iniciar sesión y agregar producto al carrito.
    2. Ir a checkout.
    3. Ingresar número de tarjeta inválido.
    4. Completar el resto de campos válidos.
    5. Click en continuar.
  - Expected: Se muestra mensaje de error de tarjeta.
- **Checkout con fecha de expiración inválida** (**Automatizado**)
  - Steps:
    1. Iniciar sesión y agregar producto al carrito.
    2. Ir a checkout.
    3. Ingresar fecha de expiración inválida.
    4. Completar el resto de campos válidos.
    5. Click en continuar.
  - Expected: Se muestra mensaje de error de expiración.
- **Checkout con CVV inválido** (**Automatizado**)
  - Steps:
    1. Iniciar sesión y agregar producto al carrito.
    2. Ir a checkout.
    3. Ingresar CVV inválido.
    4. Completar el resto de campos válidos.
    5. Click en continuar.
  - Expected: Se muestra mensaje de error de CVV.
- **Guest checkout con email inválido** (**Automatizado**)
  - Steps:
    1. Ingresar como guest.
    2. Agregar producto al carrito.
    3. Ir a checkout.
    4. Ingresar email inválido y completar el resto de campos válidos.
    5. Click en continuar.
  - Expected: Se muestra mensaje de error de email.
- **Guest checkout con email válido** (**Automatizado**)
  - Steps:
    1. Ingresar como guest.
    2. Agregar producto al carrito.
    3. Ir a checkout.
    4. Ingresar email válido y completar el resto de campos válidos.
    5. Click en continuar.
  - Expected: Avanza al resumen de orden sin errores.

### Filtros y Ordenamientos
- **Filtrar por categoría inexistente** (**Automatizado**)
  - Steps:
    1. Iniciar sesión.
    2. Seleccionar una categoría inexistente en el filtro.
  - Expected: No se muestran productos.
- **Filtrar por precio menor al más barato** (**Automatizado**)
  - Steps:
    1. Iniciar sesión.
    2. Ingresar un precio menor al más barato en el filtro.
  - Expected: No se muestran productos.
- **Ordenar por precio ascendente** (**Automatizado**)
  - Steps:
    1. Iniciar sesión.
    2. Seleccionar orden por precio ascendente.
  - Expected: El primer producto mostrado es el más barato.
- **Ordenar por nombre descendente** (**Automatizado**)
  - Steps:
    1. Iniciar sesión.
    2. Seleccionar orden por nombre descendente.
  - Expected: El primer producto mostrado es el último alfabéticamente.

### Reset y Logout
- **Reset App limpia el carrito y regresa a inventario** (**Automatizado**)
  - Steps:
    1. Iniciar sesión y agregar producto al carrito.
    2. Abrir menú lateral y hacer click en "Reset App".
  - Expected: El carrito queda vacío y se regresa a la pantalla de inventario.
- **Logout limpia usuario y carrito** (**Automatizado**)
  - Steps:
    1. Iniciar sesión y agregar producto al carrito.
    2. Hacer click en "Logout".
    3. Iniciar sesión de nuevo.
    4. Ir al carrito.
  - Expected: El carrito está vacío y el usuario anterior fue cerrado.

### Mapa/Dirección
- **No selecciona coordenadas si no se hace click en el mapa** (**Automatizado**)
  - Steps:
    1. Iniciar sesión y agregar producto al carrito.
    2. Ir a checkout.
    3. No interactuar con el mapa.
  - Expected: No se muestran coordenadas seleccionadas.
- **Selecciona coordenadas al hacer click en el mapa** (**Automatizado**)
  - Steps:
    1. Iniciar sesión y agregar producto al carrito.
    2. Ir a checkout.
    3. Hacer click en el mapa.
  - Expected: Se muestran las coordenadas seleccionadas.

---

## 2. Casos de Prueba No Automatizados (Manual o Documentado)

### Validaciones adicionales
- **Checkout con campos obligatorios vacíos** (**No automatizado**)
  - Steps:
    1. Iniciar sesión y agregar producto al carrito.
    2. Ir a checkout.
    3. Dejar uno o más campos obligatorios vacíos.
    4. Click en continuar.
  - Expected: Se muestra mensaje de error de campo requerido.
- **Selección de dirección en mapa sin seleccionar punto y luego intentar continuar** (**No automatizado**)
  - Steps:
    1. Iniciar sesión y agregar producto al carrito.
    2. Ir a checkout.
    3. No seleccionar punto en el mapa.
    4. Intentar continuar.
  - Expected: No se guardan coordenadas y/o se muestra advertencia.
- **Visualización de productos tras aplicar múltiples filtros combinados** (**No automatizado**)
  - Steps:
    1. Iniciar sesión.
    2. Aplicar varios filtros (categoría, precio).
  - Expected: Se muestran solo los productos que cumplen todos los filtros.
- **Visualización de resumen de orden con datos enmascarados (tarjeta)** (**No automatizado**)
  - Steps:
    1. Completar un checkout exitoso.
    2. Revisar el resumen de orden.
  - Expected: El número de tarjeta aparece enmascarado (solo últimos 4 dígitos).
- **Animaciones de botones (agregar al carrito, reset)** (**No automatizado**)
  - Steps:
    1. Agregar producto al carrito o hacer reset.
  - Expected: Se observa animación visual en el botón correspondiente.
- **Visualización de productos con precios negativos (debe impedir checkout)** (**No automatizado**)
  - Steps:
    1. Agregar producto con precio negativo al carrito.
    2. Intentar hacer checkout.
  - Expected: No se permite avanzar y se muestra advertencia.
- **Guardar y recuperar carrito desde localStorage (prueba de persistencia avanzada)** (**No automatizado**)
  - Steps:
    1. Agregar productos al carrito.
    2. Cerrar y volver a abrir la app.
  - Expected: El carrito se recupera correctamente desde localStorage.
- **Logout desde menú lateral** (**No automatizado**)
  - Steps:
    1. Iniciar sesión.
    2. Abrir menú lateral y hacer click en "Logout".
  - Expected: Se cierra sesión y se regresa a la pantalla de login.
- **Reset App desde menú lateral con animación** (**No automatizado**)
  - Steps:
    1. Iniciar sesión y agregar producto al carrito.
    2. Abrir menú lateral y hacer click en "Reset App".
  - Expected: Se observa animación en el botón y el carrito queda vacío.
- **Pruebas de accesibilidad y contraste** (**No automatizado**)
  - Steps:
    1. Navegar por la app usando teclado y lectores de pantalla.
    2. Revisar contraste de colores.
  - Expected: La app es accesible y cumple con estándares de contraste.

---

**Leyenda:**
- **Automatizado:** Existe script Playwright en la carpeta `tests/`
- **No automatizado:** Solo documentado/manual, pendiente de automatizar o no aplicable

**Autor:** GitHub Copilot — Agosto 2025
