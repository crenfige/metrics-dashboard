# 📊 System Performance & Telemetry Dashboard

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154.svg?logo=react-query)](https://tanstack.com/query/latest)
[![Zustand](https://img.shields.io/badge/Zustand-State_Management-4338CA.svg)](https://zustand-demo.pmnd.rs/)
[![Zod](https://img.shields.io/badge/Zod-Schema_Validation-3E67B1.svg?logo=zod)](https://zod.dev/)
[![MSW](https://img.shields.io/badge/MSW-Mock_Service_Worker-FF6A00.svg?logo=mockserviceworker)](https://mswjs.io/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit_&_Integration-729B1B.svg?logo=vitest)](https://vitest.dev/)

> **Dashboard de telemetría y monitoreo de sistemas en tiempo real.** Diseñado bajo una arquitectura modular orientada a features (**Feature-Sliced / Domain Driven**), con validación estricta de contratos de datos en tiempo de ejecución, sincronización asíncrona optimizada, visualización de datos reactiva y una suite de herramientas de Chaos Testing para evaluar resiliencia ante caídas de red.

---

## 🎯 Aspectos Técnicos Destacados

- **Contratos de Red y Type-Safety en Runtime (Zod):** Validación rigurosa de cada payload entrante de la API antes de permitir su renderizado en la capa de UI. Previene roturas silenciosas por inconsistencias de contrato entre backend y frontend.
- **Sincronización y Polling Asíncrono (TanStack Query v5):** Mecanismo de polling configurable (5s) con reintentos exponenciales, caching granular y gestión de estados desacoplados (`isLoading`, `isFetching`, `isError`).
- **Gestión de Estado de Cliente Desacoplada (Zustand):** Separación total entre el estado del servidor y el estado de la interfaz (búsqueda reactiva, filtros de severidad, modal de inspección y notificaciones Toast) sin incurrir en re-renderizados innecesarios ni sobrecarga de Context API.
- **Visualización de Datos Reactiva (Recharts):** Renderizado de sparklines de rendimiento en cada tarjeta y gráficos de área extendidos con gradientes semánticos y tooltips formateados en el modal de detalle.
- **Chaos Engineering & Resilience Panel:** Drawer interactivo flotante para inyectar fallos en caliente desde la UI:
  - Simulación de caídas de servidor (**HTTP 500**).
  - Inyección de esquemas de datos corruptos para validar el rechazo de **Zod**.
  - Inyección de **latencia artificial configurable (0 a 3000 ms)**.
- **Testing de Integración Integral (Vitest + React Testing Library + MSW):** Cobertura exhaustiva de flujos completos: carga inicial con skeletons, renderizado exitoso con mocks de red, manejo y recuperación de errores 500, búsqueda reactiva y filtrado por estado.

---

## 🏗️ Arquitectura del Proyecto

El código base sigue una estructura modular orientada a dominios/features para maximizar la escalabilidad y el desacoplamiento:

```text
src/
├── app/                        # Configuración global de la aplicación
├── components/                 # Componentes UI globales agnósticos del dominio
│   └── ui/
│       └── Skeleton.tsx
├── features/                   # Módulos de dominio autocontenidos
│   ├── chaos/                  # Panel de simulación de fallos (Chaos Testing)
│   │   ├── components/
│   │   │   └── ChaosPanel.tsx
│   │   └── stores/
│   │       └── useChaosStore.ts
│   ├── metrics/                # Feature principal: Monitoreo y Métricas
│   │   ├── __tests__/          # Tests de integración de la feature
│   │   │   └── MetricsGrid.test.tsx
│   │   ├── api/                # Data fetching con TanStack Query y Axios/Client
│   │   │   └── useMetrics.ts
│   │   ├── components/         # Componentes visuales de métricas
│   │   │   ├── MetricCard.tsx
│   │   │   ├── MetricDetailModal.tsx
│   │   │   ├── MetricSparkline.tsx
│   │   │   ├── MetricsFilters.tsx
│   │   │   └── MetricsGrid.tsx
│   │   ├── stores/             # Stores Zustand (Filtros y Detalle)
│   │   │   ├── useMetricDetailStore.ts
│   │   │   └── useMetricsFilterStore.ts
│   │   ├── types/              # Esquemas de validación Zod y tipos TypeScript
│   │   │   └── metric.schema.ts
│   │   └── utils/              # Utilidades de exportación (CSV / JSON)
│   │       └── exportMetrics.ts
│   └── notifications/          # Sistema de alertas Toast en tiempo real
│       ├── components/
│       │   └── ToastContainer.tsx
│       └── stores/
│           └── useToastStore.ts
├── lib/                        # Clientes de infraestructura (TanStack Query, Axios)
│   ├── apiClient.ts
│   └── queryClient.ts
├── mocks/                      # Interceptación de red en browser/tests (MSW)
│   ├── browser.ts
│   └── handlers.ts
├── test/                       # Setup global para Vitest y Testing Library
│   ├── server.ts
│   └── setup.ts
├── App.tsx
├── index.css
└── main.tsx
```

---

## 🚀 Inicio Rápido

### Prerrequisitos
- **Node.js**: v18.0.0 o superior
- **npm** o **pnpm** / **yarn**

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/metrics-dashboard.git
cd metrics-dashboard
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🧪 Ejecución de Tests

La suite de pruebas ejecuta tests de integración simulando interacción de usuario y respuestas de red reales interceptadas por **MSW**:

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests con interfaz interactiva
npx vitest --ui

# Ejecutar reporte de cobertura
npx vitest run --coverage
```

### Casos de Prueba Cubiertos
1. **Estado de Carga Inicial:** Valida la presencia de skeletons durante el fetching.
2. **Renderizado de Datos:** Valida el happy path tras la respuesta satisfactoria de la API.
3. **Manejo de Errores (HTTP 500):** Valida la visualización del banner de error y la acción de reintento.
4. **Búsqueda Reactiva:** Comprueba el filtrado en vivo de métricas al escribir en el input.
5. **Filtrado por Severidad:** Valida el filtrado exclusivo por estados (`Healthy`, `Warning`, `Critical`).

---

## 🛠️ Tecnologías y Librerías

| Categoría | Herramienta | Propósito |
| :--- | :--- | :--- |
| **Core** | React 19 + TypeScript | UI declarativa y tipado estático |
| **Bundler** | Vite 6 | Entorno de desarrollo rápido y HMR |
| **Estilos** | Tailwind CSS v4 | Diseño responsive, variables y utilidades |
| **Server State** | TanStack Query v5 | Polling, caching y estados asíncronos |
| **Client State** | Zustand | Gestión de estado local minimalista y performante |
| **Validación** | Zod | Runtime type safety y validación de schemas |
| **Data Viz** | Recharts | Gráficos sparklines y gráficos de área detallados |
| **Testing** | Vitest + RTL + MSW | Pruebas de integración con mockeo a nivel de red |
| **Iconografía** | Lucide React | Iconografía vectorial consistente |

---

## 📄 Licencia

Distribuido bajo la Licencia MIT.
