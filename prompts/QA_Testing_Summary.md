# Resumen de QA y Automatización para Unosquare Sports Store

## 1. Técnicas de Caja Negra y Casos de Prueba

Se generaron casos de prueba utilizando técnicas de caja negra:
- **Negativos:** Login inválido, checkout con datos erróneos, carrito vacío, total negativo, email inválido, etc.
- **Valores límite:** Longitud mínima/máxima de campos, formatos válidos/incorrectos, precios extremos, cantidades mínimas/máximas.
- **Particiones de equivalencia:** Usuario válido/inválido, guest/registrado, filtros existentes/inexistentes, etc.
- **Transición de estados:** Flujos completos de login, compra, logout, reset, navegación entre pantallas.
- **Tabla de decisiones:** Para validaciones de checkout (combinaciones de campos válidos/erróneos).

## 2. Estructura de Automatización (Page Object Model)

Se implementó automatización con Playwright usando el patrón Page Object Model (POM):

### Page Objects creados:
- `tests/pageObjects/LoginPage.ts`
- `tests/pageObjects/InventoryPage.ts`
- `tests/pageObjects/CartPage.ts`
- `tests/pageObjects/CheckoutPage.ts`

### Archivos de pruebas automatizadas:
- `tests/negativeLogin.spec.ts` — Casos negativos y límites de login
- `tests/checkoutValidation.spec.ts` — Validaciones negativas de checkout
- `tests/cartEdgeCases.spec.ts` — Límites y negativos del carrito
- `tests/filtersAndSorting.spec.ts` — Filtros y ordenamientos
- `tests/guestCheckout.spec.ts` — Guest checkout y validación de email
- `tests/resetAndLogout.spec.ts` — Reset de app y logout
- `tests/mapAddress.spec.ts` — Selección de dirección en el mapa

## 3. Flujos Automatizados Cubiertos

- **Login:**
  - Usuario/contraseña inválidos
  - Usuario especial (errorUser, performanceUser)
  - Campos vacíos
- **Carrito:**
  - Checkout deshabilitado con carrito vacío o total negativo
  - Persistencia tras recarga
  - Agregar/eliminar productos
- **Checkout:**
  - Validaciones de zip, tarjeta, expiración, CVV, email (guest)
  - Guest checkout
- **Filtros y ordenamientos:**
  - Categoría inexistente
  - Precio fuera de rango
  - Orden por nombre/precio
- **Reset y logout:**
  - Limpieza de carrito y usuario
  - Regreso a inventario/login
- **Mapa/dirección:**
  - No seleccionar coordenadas
  - Selección de coordenadas en el mapa

## 4. ¿Cómo extender?

Puedes agregar más casos siguiendo el patrón de Page Object Model y Playwright. Los archivos están listos para ampliarse según nuevos requerimientos o módulos.

---

**Autor:** GitHub Copilot — Agosto 2025

Instalar npm install mssql
Presiona Windows + R para abrir “Ejecutar”.

Escribe (según tu versión de SQL Server):

Para SQL Server 2022:

SQLServerManager16.msc

1. En el panel izquierdo, selecciona:
SQL Server Network Configuration > Protocols for MSSQLSERVER (o el nombre de tu instancia).
2. En el panel derecho:
Haz doble clic en TCP/IP.
Cambia el valor a Enabled si no lo está.
 Haz doble clic en TCP/IP y ve a la pestaña IP Addresses:
Baja hasta la sección IPAll.
En TCP Port, asegúrate de que diga:
(Si está vacío, escríbelo).
4. Haz clic en OK.
5. Reinicia el servicio de SQL Server:
En el panel izquierdo, haz clic en SQL Server Services.
En el panel derecho, haz clic derecho en SQL Server (MSSQLSERVER) y selecciona Restart.

npm install --save-dev typescript
npx tsc insert_script_result.ts

npx playwright test --reporter=json