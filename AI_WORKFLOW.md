# AI_WORKFLOW.md

> **Propósito:** Guía práctica para trabajar con múltiples IAs en el desarrollo del SGI.  
> **Filosofía:** Las IAs generan código, el humano valida que funcione.

---

## 1. IAs Disponibles y Sus Fortalezas

| IA | Mejor para | Cuándo usarla | Límite de tokens |
|----|------------|---------------|------------------|
| **GitHub Copilot** | Autocompletado inline, código pequeño | Siempre activo mientras escribes | ~2000 completions/mes |
| **Claude (Extensión/Web)** | Arquitectura, debugging profundo, explicaciones | Decisiones de diseño, errores complejos | Varía según plan |
| **Codex/GPT (Extensión/Web)** | Boilerplate masivo, código repetitivo | Generar CRUDs completos, migraciones | Varía según plan |
| **Gemini (Extensión/Web)** | Contexto largo, análisis multi-archivo | Revisar repo, bugs cross-file, refactors | Generoso en contexto |

---

## 2. Regla de Rotación de Tokens

Cuando se agoten los tokens de una IA, rotar así:

```
Copilot agotado → Usa Codex/GPT para completar código
Claude agotado  → Usa Gemini para arquitectura/análisis
GPT agotado     → Usa Claude para generar código
Gemini agotado  → Usa Claude o GPT
```

**Tip:** Guarda los prompts que funcionan bien para reutilizarlos en otra IA si es necesario.

---

## 3. Flujo de Trabajo por Tipo de Tarea

### 3.1 Crear algo nuevo (migración, modelo, controller, página)

```
1. [Claude/GPT Web] Pedir el código completo con contexto
   → Darle el PROJECT_STATUS.md + descripción de lo que necesitas
   → Pedir: migración + modelo + controller + páginas Inertia

2. [VS Code] Pegar el código en los archivos correspondientes

3. [Copilot activo] Ajustar detalles mientras editas
   → Copilot autocompleta imports, métodos faltantes, etc.

4. [Terminal] Probar que funcione
   → php artisan migrate
   → npm run dev
   → Navegar a la ruta y verificar
```

### 3.2 Corregir un bug

```
1. [Copilot/Claude Extensión] Preguntar inline qué puede estar mal
   → Seleccionar código → "¿Por qué esto no funciona?"

2. Si no lo resuelve → [Claude Web] con más contexto
   → Pegar el error completo + archivos relacionados

3. Si cruza muchos archivos → [Gemini Web]
   → Subir 5-10 archivos relacionados
   → "Encuentra la inconsistencia"
```

### 3.3 Refactorizar código existente

```
1. Refactor pequeño (1-2 archivos) → [Copilot o Claude Extensión]
2. Refactor grande (módulo completo) → [Gemini Web]
   → Subir todos los archivos del módulo
   → "Refactoriza siguiendo estas convenciones: [pegar convenciones]"
```

---

## 4. Prompt Base para Cualquier IA

Siempre que inicies conversación con una IA sobre el proyecto, empieza con este prompt base:

```markdown
## Contexto del Proyecto SGI

**Stack:** Laravel 11 + PHP 8.4+ | React 19 + Inertia.js | PostgreSQL | Tailwind v4 + shadcn/ui | Ziggy

**Convenciones:**
- Código en INGLÉS, comentarios en ESPAÑOL
- PHP: camelCase (variables/métodos), PascalCase (clases)
- BD: snake_case (tablas/columnas)
- React: PascalCase (archivos .jsx)
- Usar Inertia::render(), nunca return view()
- Usar route('nombre') en React (Ziggy)
- Lógica pesada en Services/, no en Controllers

**Fase actual:** [indicar fase]

**Tarea:** [describir lo que necesitas]
```

---

## 5. Plan de Ejecución por Fases

### FASE 0: Setup e Infraestructura

| Tarea | IA recomendada | Prompt sugerido |
|-------|----------------|-----------------|
| Configurar .env PostgreSQL | Claude/GPT | "Dame la configuración de .env para PostgreSQL en Laravel 11" |
| Limpiar archivos ejemplo | Manual | Borrar Welcome.jsx y rutas demo |
| Instalar shadcn/ui | Claude/GPT | "Pasos para instalar shadcn/ui en Laravel 11 + React + Inertia" |
| Configurar Tailwind v4 | Claude/GPT | "Configurar Tailwind CSS v4 en proyecto Laravel con Vite" |
| Verificar Ziggy | Claude/GPT | "Verificar que Ziggy funciona en componente React con Inertia" |

---

### FASE 1: Modelo de Datos Core

| Tarea | IA recomendada | Prompt sugerido |
|-------|----------------|-----------------|
| Migración categories | GPT/Codex | "[Prompt base] + Genera migración para categories (id, name, description, parent_id nullable para subcategorías, timestamps)" |
| Migración suppliers | GPT/Codex | "[Prompt base] + Genera migración para suppliers (id, name, contact_email, phone, address, timestamps)" |
| Migración products | GPT/Codex | "[Prompt base] + Genera migración para products (id, sku único, name, description, category_id FK, supplier_id FK nullable, unit_price decimal, stock_quantity integer default 0, min_stock integer default 0, timestamps)" |
| Modelos Eloquent | GPT/Codex | "[Prompt base] + Genera los 3 modelos con relaciones, fillable, casts. Category tiene hasMany products y belongsTo parent (self-referencial)" |
| Factories + Seeders | GPT/Codex | "[Prompt base] + Genera factories y un seeder que cree 5 categorías, 10 proveedores, 50 productos" |

---

### FASE 2: CRUDs Básicos

| Tarea | IA recomendada | Prompt sugerido |
|-------|----------------|-----------------|
| CRUD Categorías completo | GPT/Codex | "[Prompt base] + Genera CRUD completo de categorías: CategoryController con index/create/store/edit/update/destroy, FormRequests, y páginas Inertia (Index, Create, Edit) con shadcn/ui" |
| CRUD Proveedores | GPT/Codex | Mismo patrón que categorías |
| CRUD Productos | GPT/Codex | Mismo patrón + selects para categoría y proveedor |
| Búsqueda y paginación | Claude | "[Prompt base] + ¿Cómo implementar búsqueda y paginación en index con Inertia de forma eficiente?" |

---

### FASE 3: Lógica de Inventario

| Tarea | IA recomendada | Prompt sugerido |
|-------|----------------|-----------------|
| Diseño de StockService | Claude | "[Prompt base] + Diseña un StockService para manejar movimientos de inventario (entradas, salidas, ajustes). Debe actualizar stock_quantity automáticamente y validar stock disponible en salidas" |
| Migración stock_movements | GPT/Codex | "[Prompt base] + Migración stock_movements (id, product_id FK, type enum [entry/exit/adjustment], quantity integer, reason text nullable, user_id FK, timestamps)" |
| Implementar StockService | GPT/Codex | Darle el diseño de Claude y pedir implementación |
| Alertas stock bajo | Claude | "[Prompt base] + ¿Cómo mostrar alertas en dashboard cuando stock_quantity < min_stock?" |

---

### FASE 4: Valorización y Reporting

| Tarea | IA recomendada | Prompt sugerido |
|-------|----------------|-----------------|
| Diseño de dashboard | Claude | "[Prompt base] + Diseña qué métricas mostrar en dashboard de inventario y cómo calcularlas eficientemente" |
| Implementar dashboard | GPT/Codex | Darle el diseño de Claude |
| Historial movimientos | GPT/Codex | "[Prompt base] + Página que muestre historial de movimientos de un producto con filtros por fecha y tipo" |
| Exportación CSV/Excel | GPT/Codex | "[Prompt base] + Implementar exportación de productos a CSV usando Laravel Excel o Maatwebsite" |

---

### FASE 5: Roles y Refinamiento

| Tarea | IA recomendada | Prompt sugerido |
|-------|----------------|-----------------|
| Instalar Spatie Permission | Claude | "[Prompt base] + Pasos para instalar y configurar Spatie Laravel Permission con estos roles: admin (todo), operator (CRUD productos + movimientos), viewer (solo lectura)" |
| Implementar middleware | GPT/Codex | Darle la estructura de Claude |
| Refinar UI completa | Gemini | Subir páginas actuales + "Revisa consistencia de UI y sugiere mejoras siguiendo shadcn/ui" |
| Tests de integración | GPT/Codex | "[Prompt base] + Tests de integración para flujo: crear producto → registrar entrada → registrar salida → verificar stock" |

---

## 6. Checklist Pre-Prompt

Antes de pedir algo a cualquier IA, verificar:

- [ ] ¿Incluí el contexto del stack?
- [ ] ¿Especifiqué la fase actual?
- [ ] ¿Mencioné las convenciones de código?
- [ ] ¿La tarea es clara y específica?
- [ ] ¿Incluí archivos relacionados si es debugging?

---

## 7. Qué Hacer Cuando la IA Genera Código

```
1. LEER el código antes de pegarlo (entender qué hace)
2. VERIFICAR que sigue las convenciones (idioma, naming)
3. PEGAR en los archivos correctos
4. EJECUTAR (migrate, npm run dev, probar en browser)
5. SI FALLA → volver a la IA con el error exacto
6. SI FUNCIONA → marcar tarea como completada en PROJECT_STATUS.md
```

---

## 8. Estructura de Archivos para Referencia Rápida

Cuando generes código, estos son los paths donde va cada cosa:

```
app/Http/Controllers/         → ProductController.php
app/Http/Requests/            → StoreProductRequest.php
app/Models/                   → Product.php
app/Services/                 → StockService.php
database/migrations/          → 2024_xx_xx_create_products_table.php
database/factories/           → ProductFactory.php
database/seeders/             → ProductSeeder.php
resources/js/Pages/Products/  → Index.jsx, Create.jsx, Edit.jsx
resources/js/Components/      → ProductCard.jsx (reutilizables)
routes/web.php                → Route::resource('products', ...)
```

---

## Resumen: ¿Por Dónde Empezar?

1. **Ahora mismo:** Terminar Fase 0 (configurar PostgreSQL, shadcn, Tailwind, Ziggy)
2. **IA inicial:** Claude o GPT Web (el que tenga más tokens disponibles)
3. **Primer prompt:** El de "Configurar .env PostgreSQL" de la tabla de Fase 0
4. **Copilot:** Siempre activo en VS Code para autocompletar mientras pegas código