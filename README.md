# SobraCero – Frontend

Angular 22 · TypeScript 6 · Standalone Components · Signals · Lazy Loading · Leaflet (mapas)

Aplicación web de **SobraCero**, la plataforma de canal dual: los comercios venden sus excedentes con descuento y,
si nadie los reserva, se derivan automáticamente a una organización social como donación.
Consume la API REST del repositorio [`sobracero-backend`](https://github.com/AngelloCastillo/SobraCero) (Spring Boot 4 + JWT).

> Igual que en el backend, los nombres del dominio están en español (`Oferta`, `Reserva`, `Donacion`, `/consumidor/ofertas`).
> Lo técnico de Angular sigue en inglés (`Component`, `Service`, `routes`).

---

## Índice

1. [Requisitos](#1-requisitos)
2. [Clonar y levantar en WebStorm](#2-clonar-y-levantar-en-webstorm)
3. [Plan de distribución: las 6 partes](#3-plan-de-distribución-las-6-partes)
4. [Flujo de trabajo en GitHub](#4-flujo-de-trabajo-en-github)
5. [Estructura de carpetas](#5-estructura-de-carpetas)
6. [Arquitectura y convenciones](#6-arquitectura-y-convenciones)
7. [Mapa de endpoints → servicios](#7-mapa-de-endpoints--servicios)
8. [Desplegar](#8-desplegar)

---

## 1. Requisitos

| Herramienta | Versión | Nota |
|---|---|---|
| Node.js | **22 LTS** (≥ 22.22) o 24 | https://nodejs.org → descarga la versión LTS |
| npm | viene con Node | |
| WebStorm | 2025.3 o superior | soporte completo para Angular 22 y el nuevo control flow (`@if`, `@for`) |
| Git | cualquiera reciente | |
| Backend | `sobracero-backend` corriendo en `http://localhost:8080` | ver su README |

No hace falta instalar Angular CLI globalmente: el proyecto usa el CLI local (`npx ng …` o los scripts de `npm`).

## 2. Clonar y levantar en WebStorm

### Paso a paso

1. **Clonar.** En WebStorm: *File → New → Project from Version Control…* → pega la URL del repositorio → *Clone*.
   O por terminal:
   ```bash
   git clone https://github.com/<organizacion>/sobracero-frontend.git
   cd sobracero-frontend
   ```
2. **Instalar dependencias.** WebStorm muestra el aviso *“Run npm install”* → clic. O en la terminal integrada (`Alt+F12`):
   ```bash
   npm install
   ```
3. **Configurar Node en WebStorm.** *Settings → Languages & Frameworks → Node.js* → elige tu Node 22/24.
   En *Settings → Languages & Frameworks → TypeScript* selecciona la versión del proyecto (`node_modules/typescript`).
4. **Levantar el backend.** En IntelliJ abre `sobracero-backend` y ejecuta `SobraceroBackendApplication`
   (o `LocalEmbeddedApplication` si no tienes PostgreSQL). Comprueba http://localhost:8080/actuator/health.
5. **Levantar el frontend.**
   ```bash
   npm start          # equivale a: ng serve --open
   ```
   Abre http://localhost:4200. En WebStorm también puedes usar el panel **npm** (*View → Tool Windows → npm*) y
   hacer doble clic en `start`, o crear una configuración *Run → Edit Configurations → + → Angular CLI Server*.
6. **Entrar.** En el login despliega *“Cuentas de demostración”* y elige un rol:

   | Rol | Correo | Contraseña |
   |---|---|---|
   | Consumidor | `consumidor@demo.pe` | `Demo1234` |
   | Comercio (Premium) | `comercio1@demo.pe` | `Demo1234` |
   | Organización (SUNAT) | `ong1@demo.pe` | `Demo1234` |
   | Administrador | `admin@sobracero.pe` | `Admin1234` |

### Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo en `:4200` con recarga automática |
| `npm run build` | Build de producción en `dist/sobracero-frontend/browser` |
| `npm test` | Pruebas unitarias (Vitest) |
| `npm run format` | Formatea `ts/html/scss` con Prettier (córrelo antes de cada commit) |

### URL del backend

| Archivo | Se usa en | Valor |
|---|---|---|
| `src/environments/environment.development.ts` | `ng serve` | `http://localhost:8080` |
| `src/environments/environment.ts` | `ng build` (producción) | URL pública de Railway/Azure |

El backend ya permite CORS desde `http://localhost:*`, así que no se necesita proxy.

---

## 3. Plan de distribución: las 6 partes

La app está dividida **por dominio funcional (rol del usuario)**. Cada parte vive en **su propia carpeta**, tiene **su propio archivo de rutas** y se carga con **lazy loading**. Las 6 rutas raíz y todos los modelos y servicios HTTP **ya están creados**, así que nadie necesita editar archivos compartidos para empezar: cada desarrollador solo reemplaza los *placeholders* de su carpeta.

```
                      ┌──────────────────────────────────────────┐
                      │ PARTE 1 · core/ shared/ layout/ auth/     │  ← base que usan todos
                      └──────────────────────────────────────────┘
   ┌────────────┐ ┌─────────────┐ ┌────────────┐ ┌──────────────┐ ┌───────────────┐
   │ PARTE 2    │ │ PARTE 3     │ │ PARTE 4    │ │ PARTE 5      │ │ PARTE 6       │
   │ landing/   │ │ consumidor/ │ │ comercio/  │ │ organizacion/│ │ admin/        │
   │ (público)  │ │             │ │            │ │              │ │ impacto/      │
   └────────────┘ └─────────────┘ └────────────┘ └──────────────┘ └───────────────┘
```

### Parte 1 — Core, autenticación y layout · **Desarrollador 1** ✅ *(ya implementada)*

| | |
|---|---|
| **Carpetas** | `src/app/core/`, `src/app/shared/`, `src/app/layout/`, `src/app/features/auth/`, `src/app/features/notificaciones/` + archivos raíz (`app.routes.ts`, `app.config.ts`, `styles.scss`, `package.json`) |
| **Historias** | US23, US25, US27, TS01 (y la base técnica de todas las demás) |
| **Vistas** | `LoginPage`, `RegistroPage` (por tipo de cuenta, con mapa para la ubicación), `AuthLayoutComponent`, `ShellComponent` (barra superior, menú por rol, barra inferior móvil, campana con contador), `NotificacionesPage` |
| **Servicios** | `SesionService` (JWT + usuario en signals), `NotificadorService` (toasts), `NotificacionesEstadoService` (sondeo de la campana cada 60 s) y **los 9 servicios API** de `core/api` |
| **Infraestructura** | `authInterceptor` (Bearer token), `errorInterceptor` (401 → logout, toasts con el `detail` del backend), guards `autenticadoGuard`, `rolGuard`, `invitadoGuard`, `inicioPorRolGuard` |
| **Shared** | `PageHeader`, `EstadoBadge`, `EmptyState`, `Spinner`, `Toasts`, `MapaSelector`, pipes `soles`, `kg`, `fechaExacta`; utilidades de fechas, CSV y geolocalización |
| **Rol de equipo** | Revisa los PR que tocan `core/`, `shared/` o `package.json` y mantiene `MENU_POR_ROL` |

### Parte 2 — Landing e impacto público · **Desarrollador 2** ✅ *(ya implementada)*

| | |
|---|---|
| **Carpeta** | `src/app/features/landing/` → montada en `/` |
| **Historias** | US21, US22, US23, US24, US20 (vista pública) |
| **Vistas** | `LandingPage` (`/`): hero con propuesta de valor, *Cómo funciona*, *Para quién* (consumidor/comercio/organización), diferenciadores vs. otras apps, contador de impacto en vivo y CTA *Registrarse* (`/autenticacion/registro?rol=COMERCIO` preselecciona el rol) · `ImpactoPublicoPage` (`/nuestro-impacto`): kilos rescatados, CO₂ evitado, comercios y organizaciones activas, avance hacia la meta · `NoEncontradoPage` (404) |
| **Componentes** | `landing-header` (menú con anclas + hamburguesa móvil), `hero` (oferta de ejemplo → donación), `problema` (cifras del informe), `como-funciona`, `para-quien` (registro con rol preseleccionado), `impacto-resumen` (se oculta si el backend no responde), `diferenciadores` (tarjetas + tabla comparativa), `cta-final`, `landing-footer`, `seccion-titulo`, `contador-animado` |
| **Textos** | Todos en `landing/data/contenido-landing.ts`, tomados del informe TB1 (editar ahí, no en los componentes) |
| **Servicios** | `ImpactoApiService.plataforma()` (público) · opcional `OfertasApiService.cercanas()` para mostrar ofertas de ejemplo |

### Parte 3 — Consumidor · **Desarrollador 3** ✅ *(ya implementada)*

| | |
|---|---|
| **Carpeta** | `src/app/features/consumidor/` → `/consumidor` (rol `CONSUMIDOR`) |
| **Historias** | US06, US07, US08, US09, US10 |
| **Vistas** | `OfertasCercanasPage` (`/consumidor/ofertas`): mapa Leaflet + lista, filtros por radio (1–10 km), categoría, % de descuento y hora de recojo; sin resultados → sugerir ampliar radio · `OfertaDetallePage` (`/consumidor/ofertas/:id`): “Vence hoy a las…”, cantidad, selector de método de pago (`YAPE`, `PLIN`, `TARJETA`, `TARJETA_RECHAZADA` para probar el 402) · `MisReservasPage` (`/consumidor/reservas`): código de reserva grande, estado, ventana de recojo |
| **Componentes sugeridos** | `mapa-ofertas`, `tarjeta-oferta`, `filtros-ofertas`, `dialogo-pago`, `tarjeta-codigo-reserva` |
| **Servicios** | `OfertasApiService.cercanas()`, `.detalle()` · `ReservasApiService.reservar()`, `.mias()` |
| **Tip** | `:id` llega como `input()` gracias a `withComponentInputBinding()` → `id = input.required<string>()` |

### Parte 4 — Comercio · **Desarrollador 4** ✅ *(ya implementada)*

| | |
|---|---|
| **Carpeta** | `src/app/features/comercio/` → `/comercio` (rol `COMERCIO`) |
| **Historias** | US02, US03, US05, US09 (canje), US04 (seguimiento), US18 (estado de cuenta) |
| **Vistas** | `PublicarOfertaPage` (`/comercio/publicar`): formulario con título, categoría, cantidad, peso, precios, vencimiento y ventana de recojo; aviso si la cuenta está `PENDIENTE`/`RECHAZADA` · `MisOfertasPage` (`/comercio/mis-ofertas`): listado con estado (`ACTIVA`, `AGOTADA`, `DONADA`, `VENCIDA`, `PERDIDA`) y filtros por fecha · `CanjearCodigoPage` (`/comercio/canjear`): ingresar código de reserva · `DonacionesComercioPage` (`/comercio/donaciones`) · `PerfilComercioPage` (`/comercio/perfil`): datos, estado de validación, motivo de rechazo y plan |
| **Componentes sugeridos** | `form-oferta`, `tabla-ofertas`, `aviso-cuenta-pendiente` |
| **Servicios** | `OfertasApiService.crear()`, `.mias()` · `ReservasApiService.canjear()` · `DonacionesApiService.deComercio()` · `ComerciosApiService.yo()` |
| **Tip** | Para fechas usa `desdeInputDatetime()` y `aFechaISO()` de `core/utils/fechas.ts` (el backend espera hora de Lima sin zona) |

### Parte 5 — Organización social · **Desarrollador 5** ✅ *(ya implementada)*

| | |
|---|---|
| **Carpeta** | `src/app/features/organizacion/` → `/organizacion` (rol `ORGANIZACION`) |
| **Historias** | US04, US11, US12, US13, US14, US19, US33 |
| **Vistas** | `DonacionesDisponiblesPage` (`/organizacion/donaciones`): donaciones `OFRECIDA` con distancia y ventana; aceptar/rechazar · `MisRecojosPage` (`/organizacion/recojos`): `ACEPTADA` → confirmar con código de recojo; filtro por estado · `RegistroDonacionesPage` (`/organizacion/registro`): tabla Ley 30498 + descargar CSV · `PerfilOrganizacionPage` (`/organizacion/perfil`): capacidad diaria (kg), calificación SUNAT, impacto recibido |
| **Componentes sugeridos** | `tarjeta-donacion`, `dialogo-confirmar-recojo`, `tabla-registro`, `form-capacidad` |
| **Servicios** | `DonacionesApiService.mias()`, `.aceptar()`, `.rechazar()`, `.completar()`, `.registro()` · `OrganizacionesApiService.yo()`, `.actualizarCapacidad()` · `ImpactoApiService.organizacion()` |
| **Tip** | `descargarCsv(filas, 'registro-donaciones.csv')` de `core/utils/archivos.ts` |

### Parte 6 — Administración e impacto · **Desarrollador 6** ✅ *(ya implementada)*

| | |
|---|---|
| **Carpetas** | `src/app/features/admin/` → `/admin` (rol `ADMINISTRADOR`) · `src/app/features/impacto/` → `/impacto` (guard por ruta) |
| **Historias** | US18, US19, US26 (admin) · US01, US05, US15, US16, US17, US20 (impacto y Premium) |
| **Vistas** | `ValidarComerciosPage` (`/admin/comercios`): filtro por estado, validar, rechazar con motivo, cambiar plan · `ValidarOrganizacionesPage` (`/admin/organizaciones`): validar con check SUNAT, rechazar · `ImpactoComercioPage` (`/impacto/comercio`): kilos vendidos/donados/perdidos, ingresos, CO₂, distintivo con barra de avance, descargar reporte CSV (solo Premium) · `PrediccionPage` (`/impacto/prediccion`): predicción por categoría o invitación a Plan Premium · `ImpactoPlataformaPage` (`/impacto/plataforma`): panel agregado para el admin |
| **Componentes sugeridos** | `tabla-solicitudes`, `dialogo-rechazo`, `tarjeta-metrica`, `distintivo`, `grafico-prediccion`, `banner-premium` |
| **Servicios** | `ComerciosApiService.listar()`, `.validar()`, `.rechazar()`, `.cambiarPlan()` · `OrganizacionesApiService.listar()`, `.validar()`, `.rechazar()` · `ImpactoApiService.comercio()`, `.reporteComercioCsv()`, `.plataforma()` · `PrediccionApiService.comercio()` |
| **Tip** | El CSV llega como `Blob`: `descargarBlob(blob, 'reporte-impacto.csv')`. Con Plan Gratis el backend responde 403. |

### Resumen de propiedad

| Parte | Desarrollador | Carpeta(s) que edita | Rama base |
|---|---|---|---|
| 1 | Dev 1 | `core/`, `shared/`, `layout/`, `features/auth/`, `features/notificaciones/`, raíz | `feature/parte-1-core` |
| 2 | Dev 2 | `features/landing/` | `feature/parte-2-landing` |
| 3 | Dev 3 | `features/consumidor/` | `feature/parte-3-consumidor` |
| 4 | Dev 4 | `features/comercio/` | `feature/parte-4-comercio` |
| 5 | Dev 5 | `features/organizacion/` | `feature/parte-5-organizacion` |
| 6 | Dev 6 | `features/admin/`, `features/impacto/` | `feature/parte-6-admin-impacto` |

**Regla de oro:** *solo editas tu carpeta.* Si necesitas un componente reutilizable, créalo primero dentro de tu feature (`features/<tu-parte>/components/`). Si después otra parte lo necesita, el Dev 1 lo mueve a `shared/`.

---

## 4. Flujo de trabajo en GitHub

### Ramas

```
main       ← solo versiones estables (entregas / sprint review)
 └─ develop   ← integración; aquí se fusionan los PR
     ├─ feature/parte-1-core
     ├─ feature/parte-2-landing
     ├─ feature/parte-3-consumidor
     ├─ feature/parte-4-comercio
     ├─ feature/parte-5-organizacion
     └─ feature/parte-6-admin-impacto
```

### Primera vez (Dev 1, una sola vez)

```bash
git init && git add . && git commit -m "chore: estructura base del frontend (parte 1 + placeholders)"
git branch -M main
git remote add origin https://github.com/<organizacion>/sobracero-frontend.git
git push -u origin main
git checkout -b develop && git push -u origin develop
```

Luego en GitHub: *Settings → Branches → Add rule* para `main` y `develop` → *Require a pull request before merging*.
Edita `.github/CODEOWNERS` con los usuarios reales para que cada PR pida la revisión del dueño de la carpeta.

### Día a día (cada desarrollador)

```bash
git checkout develop && git pull
git checkout -b feature/parte-3-consumidor      # o tu rama
# ... programar ...
npm run format && npm run build                  # debe compilar
git add src/app/features/consumidor
git commit -m "feat(consumidor): mapa y lista de ofertas cercanas (US06)"
git push -u origin feature/parte-3-consumidor
```

Abre un **Pull Request hacia `develop`** (la plantilla se carga sola). Antes de abrirlo, trae lo último:
`git pull origin develop`. En WebStorm todo esto está en *Git → Branches* y *Git → Pull Requests*.

### Commits (Conventional Commits)

`feat(comercio): …` · `fix(auth): …` · `style(landing): …` · `refactor(core): …` · `docs: …`

### Cómo se evitan los conflictos

- **Rutas congeladas:** `app.routes.ts` ya monta las 6 partes; cada parte solo toca su `*.routes.ts`.
- **Contratos congelados:** modelos (`core/models`) y servicios (`core/api`) ya reflejan el backend. Si el backend cambia, el cambio lo hace solo el Dev 1.
- **Dependencias preinstaladas:** `leaflet` ya está en `package.json`. Si necesitas otra librería, pídesela al Dev 1 (así `package-lock.json` no genera conflictos).
- **Menú:** las entradas de todos los roles ya están en `core/auth/rutas-por-rol.ts`.
- **Estilos:** cada componente tiene sus estilos encapsulados; solo se usan las variables globales de `styles.scss`.
- **Formato:** `.editorconfig` + Prettier (`npm run format`) evitan diffs por espacios o comillas.

---

## 5. Estructura de carpetas

```
sobracero-frontend/
├── .github/
│   ├── CODEOWNERS                       # dueño por carpeta
│   └── pull_request_template.md
├── public/
├── src/
│   ├── environments/
│   │   ├── environment.ts                # producción (URL pública del backend)
│   │   └── environment.development.ts    # local (http://localhost:8080)
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss                       # tokens de diseño (colores, botones, formularios, grilla)
│   └── app/
│       ├── app.ts                        # <router-outlet> + <app-toasts>
│       ├── app.config.ts                 # router, HttpClient e interceptores
│       ├── app.routes.ts                 # 🔒 monta las 6 partes (lazy loading)
│       │
│       ├── core/                         # ── PARTE 1 ──
│       │   ├── config/api.config.ts      # API_URL
│       │   ├── models/                   # interfaces = DTOs del backend
│       │   │   ├── comun.model.ts        #   Rol, EstadoCuenta, Plan, ProblemDetail
│       │   │   ├── autenticacion.model.ts
│       │   │   ├── oferta.model.ts
│       │   │   ├── reserva.model.ts
│       │   │   ├── donacion.model.ts
│       │   │   ├── comercio.model.ts
│       │   │   ├── organizacion.model.ts
│       │   │   ├── impacto.model.ts
│       │   │   ├── prediccion.model.ts
│       │   │   ├── notificacion.model.ts
│       │   │   └── index.ts
│       │   ├── api/                      # un servicio por controlador del backend
│       │   │   ├── autenticacion-api.service.ts
│       │   │   ├── ofertas-api.service.ts
│       │   │   ├── reservas-api.service.ts
│       │   │   ├── donaciones-api.service.ts
│       │   │   ├── comercios-api.service.ts
│       │   │   ├── organizaciones-api.service.ts
│       │   │   ├── impacto-api.service.ts
│       │   │   ├── prediccion-api.service.ts
│       │   │   ├── notificaciones-api.service.ts
│       │   │   └── index.ts
│       │   ├── auth/
│       │   │   ├── sesion.service.ts     # JWT + usuario (signals, localStorage)
│       │   │   └── rutas-por-rol.ts      # inicio y menú de cada rol
│       │   ├── guards/auth.guard.ts      # autenticado, rol, invitado, inicio
│       │   ├── interceptors/             # auth (Bearer) y error (toasts / 401)
│       │   └── utils/                    # fechas, errores, CSV, geolocalización, toasts
│       │
│       ├── shared/                       # ── PARTE 1 ──
│       │   ├── ui/                       # page-header, estado-badge, empty-state, spinner,
│       │   │                             # toasts, mapa-selector, en-construccion
│       │   ├── pipes/                    # soles, kg, fechaExacta
│       │   └── index.ts
│       │
│       ├── layout/                       # ── PARTE 1 ──
│       │   ├── shell.component.{ts,html,scss}
│       │   └── notificaciones-estado.service.ts
│       │
│       └── features/
│           ├── auth/                     # ── PARTE 1 ── /autenticacion/login, /registro
│           ├── notificaciones/           # ── PARTE 1 ── /notificaciones
│           ├── landing/                  # ── PARTE 2 ── /, /nuestro-impacto, 404
│           │   ├── landing.routes.ts
│           │   ├── landing/landing.page.ts
│           │   ├── impacto-publico/impacto-publico.page.ts
│           │   └── no-encontrado/no-encontrado.page.ts
│           ├── consumidor/               # ── PARTE 3 ── /consumidor/...
│           │   ├── consumidor.routes.ts
│           │   ├── ofertas-cercanas/
│           │   ├── oferta-detalle/
│           │   └── mis-reservas/
│           ├── comercio/                 # ── PARTE 4 ── /comercio/...
│           │   ├── comercio.routes.ts
│           │   ├── publicar-oferta/
│           │   ├── mis-ofertas/
│           │   ├── canjear-codigo/
│           │   ├── donaciones-comercio/
│           │   └── perfil-comercio/
│           ├── organizacion/             # ── PARTE 5 ── /organizacion/...
│           │   ├── organizacion.routes.ts
│           │   ├── donaciones-disponibles/
│           │   ├── mis-recojos/
│           │   ├── registro-donaciones/
│           │   └── perfil-organizacion/
│           ├── admin/                    # ── PARTE 6 ── /admin/...
│           │   ├── admin.routes.ts
│           │   ├── validar-comercios/
│           │   └── validar-organizaciones/
│           └── impacto/                  # ── PARTE 6 ── /impacto/...
│               ├── impacto.routes.ts
│               ├── impacto-comercio/
│               ├── prediccion/
│               └── impacto-plataforma/
├── angular.json
├── package.json
└── tsconfig.json                         # alias @core, @shared, @layout, @features, @env
```

---

## 6. Arquitectura y convenciones

- **Standalone Components + lazy loading por feature** (`loadChildren` por parte, `loadComponent` por pantalla). Sin `NgModule`.
- **Signals** para el estado (`signal`, `computed`, `input()`, `output()`), **control flow nuevo** (`@if`, `@for`) e `inject()` en lugar de constructores.
- **Reactive Forms** tipados (`FormBuilder.nonNullable`).
- **Alias de importación:** `@core/...`, `@shared/...`, `@layout/...`, `@features/...`, `@env/...`.
- **Nombres:** página = `xxx.page.ts` (clase `XxxPage`), componente reutilizable = `xxx.component.ts`, servicio API = `xxx-api.service.ts`.
- **Errores:** el `errorInterceptor` ya muestra un toast con el `detail` del backend. Si una pantalla quiere mostrar el error ella misma, envía la petición con `context: new HttpContext().set(SIN_TOAST_DE_ERROR, true)` y usa `mensajeDeError(err)`.
- **Fechas:** el backend usa `LocalDateTime` en hora de Lima **sin zona**. No uses `toISOString()` (convierte a UTC); usa `core/utils/fechas.ts` y el pipe `fechaExacta` (“hoy a las 7:00 p. m.”).
- **Diseño:** colores y tipografía del informe (Verde `#10B981`, Naranja `#FF9800`, Rojo `#EF4444`, Inter, grilla de 8 px, 12/8/4 columnas). Usa las clases globales `.btn`, `.btn--primario`, `.tarjeta`, `.campo`, `.tabla` y las variables `var(--verde)`, etc.
- **Accesibilidad:** botones de mínimo 44 px de alto, `label` en cada campo, foco visible.

### Plantilla para reemplazar un placeholder

```ts
// src/app/features/comercio/mis-ofertas/mis-ofertas.page.ts
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { OfertasApiService } from '@core/api';
import { EstadoBadgeComponent, PageHeaderComponent, SolesPipe, SpinnerComponent } from '@shared/index';

@Component({
  selector: 'app-mis-ofertas-page',
  imports: [PageHeaderComponent, EstadoBadgeComponent, SpinnerComponent, SolesPipe],
  template: `
    <app-page-header titulo="Mis ofertas" />
    @if (ofertas.isLoading()) { <app-spinner /> }
    @for (o of ofertas.value() ?? []; track o.id) {
      <div class="tarjeta">{{ o.titulo }} · {{ o.precioDescuento | soles }} <app-estado-badge [estado]="o.estado" /></div>
    }
  `,
})
export class MisOfertasPage {
  private readonly api = inject(OfertasApiService);
  protected readonly ofertas = rxResource({ stream: () => this.api.mias() });
}
```

---

## 7. Mapa de endpoints → servicios

El backend solo usa `GET`, `POST` y `PATCH` (no expone `PUT` ni `DELETE`); los servicios replican exactamente eso.

| Método y ruta | Rol | Servicio · método | Tipo de respuesta |
|---|---|---|---|
| `POST /api/autenticacion/registro` | público | `AutenticacionApiService.registrar` (vía `SesionService`) | `RespuestaAutenticacion` |
| `POST /api/autenticacion/login` | público | `AutenticacionApiService.login` (vía `SesionService`) | `RespuestaAutenticacion` |
| `GET /api/autenticacion/yo` | autenticado | `AutenticacionApiService.yo` | `UsuarioVista` |
| `GET /api/ofertas/cercanas?lat&lng&radioKm` | público | `OfertasApiService.cercanas` | `OfertaVista[]` |
| `GET /api/ofertas/{id}` | público | `OfertasApiService.detalle` | `OfertaVista` |
| `POST /api/ofertas` | COMERCIO | `OfertasApiService.crear` | `Oferta` |
| `GET /api/ofertas/mias` | COMERCIO | `OfertasApiService.mias` | `Oferta[]` |
| `POST /api/reservas` | CONSUMIDOR | `ReservasApiService.reservar` | `ReservaVista` (402 si el pago falla) |
| `GET /api/reservas/mias` | CONSUMIDOR | `ReservasApiService.mias` | `ReservaVista[]` |
| `POST /api/reservas/canjear` | COMERCIO | `ReservasApiService.canjear` | `ReservaVista` (409 si ya se usó) |
| `GET /api/donaciones/mias` | ORGANIZACION | `DonacionesApiService.mias` | `DonacionVista[]` |
| `POST /api/donaciones/{id}/aceptar` | ORGANIZACION | `DonacionesApiService.aceptar` | `DonacionVista` |
| `POST /api/donaciones/{id}/rechazar` | ORGANIZACION | `DonacionesApiService.rechazar` | `void` |
| `POST /api/donaciones/completar` | ORGANIZACION | `DonacionesApiService.completar` | `DonacionVista` |
| `GET /api/donaciones/registro` | ORGANIZACION | `DonacionesApiService.registro` | `FilaRegistroDonacion[]` |
| `GET /api/donaciones/comercio` | COMERCIO | `DonacionesApiService.deComercio` | `DonacionVista[]` |
| `GET /api/comercios/yo` | COMERCIO | `ComerciosApiService.yo` | `Comercio` |
| `GET /api/comercios?estado=` | ADMINISTRADOR | `ComerciosApiService.listar` | `Comercio[]` |
| `PATCH /api/comercios/{id}/validar` | ADMINISTRADOR | `ComerciosApiService.validar` | `Comercio` |
| `PATCH /api/comercios/{id}/rechazar` | ADMINISTRADOR | `ComerciosApiService.rechazar` | `Comercio` |
| `PATCH /api/comercios/{id}/plan` | ADMINISTRADOR | `ComerciosApiService.cambiarPlan` | `Comercio` |
| `GET /api/organizaciones/yo` | ORGANIZACION | `OrganizacionesApiService.yo` | `OrganizacionSocial` |
| `PATCH /api/organizaciones/yo/capacidad` | ORGANIZACION | `OrganizacionesApiService.actualizarCapacidad` | `OrganizacionSocial` |
| `GET /api/organizaciones?estado=` | ADMINISTRADOR | `OrganizacionesApiService.listar` | `OrganizacionSocial[]` |
| `PATCH /api/organizaciones/{id}/validar` | ADMINISTRADOR | `OrganizacionesApiService.validar` | `OrganizacionSocial` |
| `PATCH /api/organizaciones/{id}/rechazar` | ADMINISTRADOR | `OrganizacionesApiService.rechazar` | `OrganizacionSocial` |
| `GET /api/impacto/comercio` | COMERCIO | `ImpactoApiService.comercio` | `ImpactoComercio` |
| `GET /api/impacto/comercio/reporte.csv` | COMERCIO Premium | `ImpactoApiService.reporteComercioCsv` | `Blob` (403 con Plan Gratis) |
| `GET /api/impacto/organizacion` | ORGANIZACION | `ImpactoApiService.organizacion` | `ImpactoOrganizacion` |
| `GET /api/impacto/plataforma` | público | `ImpactoApiService.plataforma` | `ImpactoPlataforma` |
| `GET /api/prediccion/comercio` | COMERCIO Premium | `PrediccionApiService.comercio` | `Prediccion` |
| `GET /api/notificaciones` | autenticado | `NotificacionesApiService.mias` | `NotificacionesVista` |
| `POST /api/notificaciones/leer-todas` | autenticado | `NotificacionesApiService.leerTodas` | `void` |

---

## 8. Desplegar

**Netlify / Vercel / Azure Static Web Apps**

1. En `src/environments/environment.ts` pon la URL pública del backend.
2. Build command: `npm run build` · Publish directory: `dist/sobracero-frontend/browser`.
3. Como es una SPA, agrega la regla de reescritura a `index.html` (en Netlify: archivo `public/_redirects` con `/*  /index.html  200`).
4. En el backend (Railway) agrega la URL del frontend a la variable `CORS_ALLOWED_ORIGINS`.
