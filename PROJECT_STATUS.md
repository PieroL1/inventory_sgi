# PROJECT_STATUS.md

> **Proyecto:** SGI (Sistema de Gestión de Inventario)  
> **Arquitectura:** Monolito moderno modular  
> **Última actualización:** *(actualizar con cada cambio significativo)*

---

## 1. Visión General

Sistema monolítico modular para **control de stock, proveedores, movimientos de inventario y valorización**.

Principios del proyecto:
- Código limpio, tipado (donde aplique) y bien documentado.
- Facilitar mantenimiento por humanos y lectura por IAs.
- Sin API REST tradicional: usamos **Inertia.js** para comunicación frontend-backend.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| **Backend** | Laravel | 11 |
| **Lenguaje Backend** | PHP | 8.4+ |
| **Frontend** | React | 19 |
| **Puente SPA** | Inertia.js | — |
| **Routing Frontend** | Ziggy | — |
| **Estilos** | Tailwind CSS | v4 |
| **Componentes UI** | shadcn/ui | — |
| **Base de Datos** | PostgreSQL | — |

---

## 3. Convenciones de Código (Estrictas)

*Mantener consistencia en todo el proyecto.*

### 3.1 Idioma
| Elemento | Idioma |
|----------|--------|
| Código (variables, funciones, clases, BD) | **INGLÉS** |
| Comentarios, commits, documentación (MD) | **ESPAÑOL** |

### 3.2 Naming
| Contexto | Convención | Ejemplo |
|----------|------------|---------|
| PHP Variables/Métodos | `camelCase` | `$userProfile`, `storeUser()` |
| PHP Clases | `PascalCase` | `ProductController` |
| BD Tablas/Columnas | `snake_case` | `product_categories`, `created_at` |
| Archivos JS/React | `PascalCase` | `ProductList.jsx` |
| Rutas (web.php) | `kebab-case` | `products.index`, `stock-movements.store` |

### 3.3 Arquitectura
- **Renderizado:** Usar `Inertia::render()` para todas las vistas.
- **Rutas en React:** Usar Ziggy → `route('products.index')`.
- **Lógica pesada:** Mover a **Services** o **Actions** (no en controladores).
- **Modelos:** Usar casts, fillable explícito, y relaciones tipadas.

---

## 4. Roles de IAs en el Proyecto

| IA | Rol | Tareas típicas |
|----|-----|----------------|
| **Claude 4.5 (Sonnet/Opus)** | Arquitecto principal | Diseño de módulos, decisiones de stack, debugging profundo de framework, revisión de arquitectura |
| **GPT-5.1 (Instant/Thinking)** | Picapiedra de código | Generar pantallas Inertia+React+Tailwind+shadcn, migraciones, factories, tests, glue code rápido |
| **Gemini 3 Pro** | Inspector de contexto | Revisar repo completo, hunting de bugs cross-file, refactors masivos, análisis de rendimiento |
| **GitHub Copilot** | Pair programmer (IDE) | Autocompletado, refactors pequeños/medianos, tests rápidos, explicaciones de código |

**Instrucción clave:** Cada IA debe leer este documento completo antes de actuar. Respetar el rol asignado y las convenciones.

---

## 5. Estado Actual

| Campo | Valor |
|-------|-------|
| **Fase actual** | Fase 2: CRUDs Básicos |
| **Última actualización** | 2025-12-29 - Búsqueda y paginación implementadas |
| **Bloqueadores** | Ninguno |

---

## 6. Roadmap y Progreso Detallado

### [x] Fase 0: Setup e Infraestructura
- [x] Instalar Laravel 11 + Breeze (stack React).
- [x] Configurar Base de Datos PostgreSQL en `.env`.
- [x] Limpiar archivos de ejemplo (`Welcome.jsx`, rutas demo).
- [x] Configurar tema base de Tailwind v4.
- [x] Instalar y configurar shadcn/ui.
- [x] Verificar Ziggy funcionando en React.

**Bitácora F0:**
- Se inicializó el proyecto con Laravel 11 y Breeze.
- (29-dic) Eliminado `Welcome.jsx` y rutas demo de Breeze.
- (29-dic) Ruta raíz `/` ahora redirige al dashboard.
- (29-dic) `Dashboard.jsx` actualizado con mensaje inicial del SGI.
- (29-dic) `APP_NAME` configurado como "SGI" en `.env`.
- (29-dic) Tailwind actualizado a v4.1.18 con nueva sintaxis CSS.
- (29-dic) Eliminados `tailwind.config.js` y `postcss.config.js` (obsoletos en v4).
- (29-dic) Tema base SGI configurado en `app.css` con colores primary/success/warning/danger.
- (29-dic) shadcn/ui inicializado (estilo new-york, color base neutral, JSX).
- (29-dic) Componentes base instalados: Button, Card, Input, Label, Table.
- (29-dic) Creado `components.json` y utilidad `cn()` en `lib/utils.js`.
- (29-dic) Ziggy verificado: `@routes` en blade, `route()` funcionando en componentes React.
- (29-dic) **FASE 0 COMPLETADA** - Servidor probado en http://127.0.0.1:8000

---

### [x] Fase 1: Modelo de Datos Core
- [x] Migración: `categories` (id, name, description, parent_id nullable, is_active, timestamps).
- [x] Migración: `suppliers` (id, name, contact_email, phone, address, is_active, timestamps).
- [x] Migración: `products` (id, sku, name, description, category_id, supplier_id, cost_price, unit_price, stock_quantity, min_stock, is_active, timestamps).
- [x] Crear Modelos Eloquent con relaciones y casts.
- [x] Crear Factories y Seeders básicos.

**Bitácora F1:**
- (29-dic) Creadas migraciones para `categories`, `suppliers` y `products`.
- (29-dic) Agregados campos extra: `is_active` en las 3 tablas, `cost_price` en products.
- (29-dic) Modelos con `HasFactory`, `$fillable`, `$casts` y relaciones tipadas.
- (29-dic) Product incluye métodos `isLowStock()` y `profitMargin()`.
- (29-dic) Factories con estados `inactive()` y `lowStock()` para testing.
- (29-dic) Seeder genera: 8 categorías, 10 proveedores, 35 productos (5 con stock bajo).
- (29-dic) Usuario de prueba: admin@sgi.test
- (29-dic) **FASE 1 COMPLETADA**

---

### [ ] Fase 2: CRUDs Básicos
- [x] CRUD Categorías (Controller, páginas Inertia, validación).
- [x] CRUD Proveedores.
- [x] CRUD Productos (con selects de categoría y proveedor).
- [x] Corregir dropdown de acciones (Editar/Eliminar).
- [x] Implementar búsqueda y paginación básica.
- [ ] Mejorar diseño UI.

**Bitácora F2:**
- (29-dic) CategoryController, SupplierController, ProductController creados.
- (29-dic) FormRequests con validación y mensajes en español.
- (29-dic) Páginas Index/Create/Edit para las 3 entidades.
- (29-dic) Navegación actualizada con enlaces a Categorías, Proveedores, Productos.
- (29-dic) Componentes shadcn/ui: Dialog, Dropdown-menu, Badge, Alert, Select, Textarea, Separator, Sonner.
- (29-dic) Hook useFlashMessages para notificaciones toast.
- (29-dic) **BUG CORREGIDO:** Dropdown de acciones - conflicto entre `Slot` de Radix y `Button` de shadcn. Solución: usar `<button>` nativo en `DropdownMenuTrigger` y `router.visit()` en lugar de `<Link>` con `asChild`.
- (29-dic) Configurado alias `@` en `vite.config.js` para imports.
- (29-dic) Corregido `sonner.jsx` - removido `useTheme` de next-themes (no hay ThemeProvider).
- (29-dic) Agregado `modal={false}` a `DropdownMenu` para evitar bloqueo de scroll.
- (29-dic) **Búsqueda y paginación implementadas** en los 3 CRUDs:
  - Categories: búsqueda por nombre/descripción + filtro estado.
  - Suppliers: búsqueda por nombre/email/teléfono + filtro estado.
  - Products: búsqueda por nombre/SKU/descripción + filtros por categoría, proveedor, estado y stock bajo.
  - Paginación mejorada con números de página clickeables y `withQueryString()` para preservar filtros.

---

### [ ] Fase 3: Lógica de Inventario
- [ ] Migración: `stock_movements` (id, product_id, type [entry/exit/adjustment], quantity, reason, user_id, timestamps).
- [ ] Servicio `StockService` para registrar movimientos.
- [ ] Actualización automática de `stock_quantity` en productos.
- [ ] Alertas de stock bajo (cuando `stock_quantity < min_stock`).

**Bitácora F3:**
- *(pendiente)*

---

### [ ] Fase 4: Valorización y Reporting
- [ ] Cálculo de valor total de inventario (sum de unit_price * stock_quantity).
- [ ] Historial de movimientos por producto.
- [ ] Dashboard con métricas clave (productos bajo stock, valor total, movimientos recientes).
- [ ] Exportación básica (CSV/Excel).

**Bitácora F4:**
- *(pendiente)*

---

### [ ] Fase 5: Roles, Permisos y Refinamiento
- [ ] Implementar roles básicos (admin, operador, viewer) con Spatie Permission o similar.
- [ ] Restringir acciones según rol.
- [ ] Refinar UI/UX general.
- [ ] Tests de integración para flujos críticos.
- [ ] Documentación final de uso.

**Bitácora F5:**
- *(pendiente)*

---

## 7. Instrucciones para IAs

### 7.1 Antes de responder
1. **Lee completo** las secciones 2 (Stack), 3 (Convenciones), 4 (Roles) y 5 (Estado Actual).
2. **Identifica tu rol** según la tabla de la sección 4.
3. **Verifica la fase actual** para saber qué está hecho y qué falta.

### 7.2 Al generar código
- Usa **Tailwind CSS v4** para estilos (no CSS custom salvo excepciones justificadas).
- Usa **shadcn/ui** para componentes (Button, Input, Card, Table, etc.).
- Usa `Inertia::render()` en controladores, nunca `return view()`.
- Usa `route('nombre.ruta')` en React (Ziggy), no URLs hardcodeadas.
- Respeta el idioma: código en inglés, comentarios en español.

### 7.3 Al modificar este documento
- Actualiza el campo "Última actualización" en la sección 5.
- Marca los checkboxes completados `[x]`.
- Agrega notas a la Bitácora de la fase correspondiente.

---

## 8. Estructura de Carpetas (Referencia)

```
app/
├── Http/Controllers/      # Controladores (delgados, solo orquestación)
├── Models/                # Modelos Eloquent
├── Services/              # Lógica de negocio pesada
└── Actions/               # Acciones simples y reutilizables

resources/js/
├── Components/            # Componentes React reutilizables
├── Layouts/               # Layouts de página
└── Pages/                 # Páginas Inertia (una por ruta)

database/
├── migrations/            # Migraciones de BD
├── factories/             # Factories para testing/seeding
└── seeders/               # Seeders
```

---

## Resumen de cambios respecto a la versión anterior

- **[Corrección crítica]** Base de datos: `MySQL` → `PostgreSQL`.
- **[Nueva sección]** Sección 2 "Stack Tecnológico" con tabla de versiones específicas.
- **[Nueva sección]** Sección 4 "Roles de IAs en el Proyecto" con tabla de responsabilidades.
- **[Nueva sección]** Sección 8 "Estructura de Carpetas" como referencia rápida.
- **[Expansión]** Roadmap ampliado de 3 fases (0-2) a 6 fases (0-5) con detalle de tareas.
- **[Mejora]** Convenciones reorganizadas en subsecciones (Idioma, Naming, Arquitectura).
- **[Mejora]** Instrucciones para IA expandidas con pasos claros antes/durante/después.
- **[Mejora]** Estado Actual convertido a tabla para lectura rápida.
- **[Formato]** Uso de tablas Markdown para mejor legibilidad por humanos e IAs.
- **[Consistencia]** Mención explícita de "monolito moderno modular" y "sin API REST tradicional".