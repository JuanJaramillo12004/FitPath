# FitPath — Documentación completa

Este README explica en detalle cómo está estructurado y funciona el proyecto FitPath (Expo + React Native + Supabase). Está diseñado para ayudarte a entender cada parte del código y prepararte para una prueba técnica.

---

## Resumen rápido

- Propósito: app móvil para gestionar viajes/`trips` de usuarios, con autenticación, mapas y estadísticas.
- Stack: Expo (React Native), TypeScript, `expo-router`, `@react-navigation/native`, Supabase (DB + Auth), `react-native-reanimated`.

---

## Primeros pasos (desarrollo local)

Requisitos:
- Node.js (LTS)
- Yarn o npm
- Expo CLI (opcional) — `npm install -g expo-cli`

Variables de entorno que necesitas crear (ej. `.env` o en tu entorno de CI):
- `SUPABASE_URL` — URL del proyecto Supabase
- `SUPABASE_ANON_KEY` — clave pública (anon)

Comandos básicos:

```bash
# instalar dependencias
npm install
# o
yarn

# iniciar Expo
npx expo start
```

Si tienes scripts personalizados en `package.json`, úsalos según estén definidos.

---

## Estructura del proyecto (visión general)

- `app/` — pantallas y layouts. Rutas basadas en archivos usando `expo-router`.
  - `app/_layout.tsx` — layout raíz y control de navegación (temas + redirecciones auth).
  - `app/login.tsx`, `app/register.tsx` — pantallas de autenticación.
  - `app/modal.tsx` — modal del stack.
  - `app/(tabs)/` — carpeta con layout de pestañas y pantallas: `index.tsx`, `map.tsx`, `trips.tsx`.
- `components/` — componentes reutilizables y subcarpeta `components/ui/` para elementos pequeños.
- `contexts/` — providers y contextos (ej. `auth-context.tsx`).
- `hooks/` — hooks personalizados (`use-trips`, `use-user`, `use-stats`, `use-color-scheme`, etc.).
- `services/` — capa que habla con Supabase (`auth.service.ts`, `trip.service.ts`, `user.service.ts`, `stats.service.ts`, `supabase.ts`).
- `supabase/` — `schema.sql` con el diseño de la BD.
- `types/` — tipos TypeScript para entidades y tablas.
- `assets/` — imágenes y recursos estáticos.

---

## Navegación y layout (archivo clave)

Mira `app/_layout.tsx` — este archivo configura el `ThemeProvider` y las rutas principales. Puntos importantes:

- `ThemeProvider` (de `@react-navigation/native`) aplica `DarkTheme` o `DefaultTheme` según `useColorScheme()`.
- `AuthProvider` envuelve la navegación y provee `useAuth()` en toda la UI.
- `useSegments()` (de `expo-router`) devuelve la ruta actual en forma de segmentos; se usa para decidir redirecciones.
- `useEffect` con dependencia en `[isAuthenticated, loading, segments, router]` implementa la lógica:
  - Si `loading` es `true`, no hace nada (espera restauración de sesión).
  - Si no autenticado y la ruta pertenece a las pestañas (`(tabs)`), redirige a `/login`.
  - Si autenticado y está en `login`/`register` o en la raíz, redirige a `/(tabs)`.
  - Si no autenticado y la ruta es raíz, redirige a `/login`.

Esto protege las pantallas privadas y evita que usuarios autenticados regresen al login.

---

## Autenticación y `AuthProvider`

- `contexts/auth-context.tsx` encapsula la lógica de sesión: mantiene `user`, `isAuthenticated` y `loading`.
- En el montaje, normalmente intenta restaurar la sesión con Supabase (ej. `supabase.auth.getSession()` o `onAuthStateChange`).
- Expone funciones como `signIn`, `signOut`, `register`, que delegan a `services/auth.service.ts`.
- Las pantallas de `login.tsx` y `register.tsx` llaman a esos métodos y muestran errores.

Consejo de seguridad: la verificación de permisos definitiva debe ser hecha en la base de datos (RLS) o en funciones del servidor. El cliente solo protege la navegación UX.

---

## Hooks personalizados (qué hacen y por qué)

- `use-color-scheme.ts`: detecta tema del sistema y devuelve `'light' | 'dark'`.
- `use-theme-color.ts`: mapea colores propios encima del theme base (por ejemplo tokens de color).
- `use-trips.ts`: encapsula fetch, creación, edición y eliminación de viajes; puede exponer estado (`data`, `loading`, `error`) y funciones (`createTrip`, `updateTrip`, `deleteTrip`, `refetch`).
- `use-user.ts`, `use-stats.ts`: similares pero para perfil y estadísticas.

Ventajas: desacopla la UI de la fuente de datos, facilita pruebas y reutilización.

---

## Servicios (capa de acceso a Supabase)

- `services/supabase.ts`: instancia y exporta el cliente Supabase configurado con `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
- `services/auth.service.ts`: wrappers para `signInWithPassword`, `signOut`, ver usuario.
- `services/trip.service.ts`: funciones `create`, `read`, `update`, `delete` sobre la tabla `trips`.
- `services/user.service.ts` y `services/stats.service.ts`: abstracciones para las consultas relacionadas.

Buenas prácticas:
- Manejar errores y devolver mensajes útiles al UI.
- En operaciones sensibles, usar RLS (Row Level Security) y funciones seguras en la DB.

---

## Base de datos (Supabase)

- Revisa `supabase/schema.sql` para ver tablas y relaciones (ej.: `users`, `trips`).
- Revisa políticas RLS si existen en el SQL: aseguran que solo el propietario puede leer/editar sus filas.
- Para desarrollo local, puedes usar Supabase CLI o la interfaz web para ejecutar `schema.sql`.

---

## Componentes y theming

- `components/themed-text.tsx` y `components/themed-view.tsx`: utilizan `useTheme()` para aplicar colores y tipografía según el theme actual.
- `components/ui/` contiene pequeños widgets reutilizables (`collapsible`, `icon-symbol`, etc.).
- Recomendación: seguir la convención de pasar props de estilo y mantener componentes puros (sin lógica de fetch dentro).

---

## Typescript: `types/`

- Los archivos en `types/` definen las formas de datos (p. ej. `Trip`, `User`) y mapeos a tablas de Supabase.
- Úsalos en servicios, hooks y componentes para asegurar seguridad de tipos y autocompletado.

---

## Flujo típico de la app (ejemplo)

1. App arranca; `AuthProvider` intenta restaurar sesión.
2. `RootLayoutNav` espera `loading === false`. Si no autenticado, redirige a `/login`.
3. Usuario ingresa credenciales en `login.tsx` → `auth.service.signIn` → contexto actualizado.
4. Usuario es redirigido a `/(tabs)` y puede ver `map`, `trips`, etc.
5. Crear un `trip` usa `trip.service.create`, `use-trips` actualiza el estado y la UI refleja el nuevo viaje.

---

## Debug y recomendaciones al desarrollar

- Usa logs y devtools de React Native / Expo para inspeccionar hooks y estados.
- Verifica que `SUPABASE_URL` y `SUPABASE_ANON_KEY` estén correctamente configurados.
- Si hay problemas de navegación, revisa `useSegments()` y la lógica de redirección en `app/_layout.tsx`.

---

## Preguntas de entrevista y respuestas modelo (práctica rápida)

- ¿Cómo proteges rutas en esta app?
  - Respuesta: `RootLayoutNav` comprueba `isAuthenticated` desde `AuthProvider` y redirige según segmentos; además la DB debe tener RLS para evitar accesos indebidos.

- ¿Por qué separar `services/` y `hooks/`?
  - Respuesta: `services` contiene la lógica de acceso a la API/DB, mientras que `hooks` orquestan llamadas, estado local y efectos. Esto facilita tests unitarios y reutilización.

- ¿Cómo implementarías notificaciones en tiempo real para nuevos viajes?
  - Respuesta: usar las funcionalidades en tiempo real de Supabase (`supabase.channel` / suscripciones) en `use-trips` para actualizar el listado al recibir eventos.

---

## Tareas sugeridas para practicar (práctico)

- Abrir y comentar línea a línea `app/_layout.tsx` y `contexts/auth-context.tsx`.
- Implementar validación adicional en el formulario de `createTrip`.
- Añadir pruebas unitarias a un hook (mockear `services/trip.service.ts`).
- Revisar `supabase/schema.sql` y explicar cada tabla y FK.

---

## Contribuir / próximos pasos

- Si quieres, puedo:
  - Generar comentarios línea por línea en `contexts/auth-context.tsx`.
  - Abrir y explicar `services/trip.service.ts` con ejemplos de requests.
  - Añadir scripts de `npm` para `lint`, `type-check`, y `format`.

Indica qué prefieres y continúo con la siguiente parte.

---

© Documentación generada automáticamente para ayudarte en la preparación técnica.


# FitPath — Documentación completa por archivo

Este documento expande el README y explica archivo por archivo la estructura, el propósito y el flujo del proyecto FitPath. Está pensado para que puedas estudiar y explicar cada parte en una prueba técnica.

---

**Nota:** los caminos se indican relativos a la raíz del proyecto.

## Raíz y archivos de configuración

- `package.json` — define dependencias, scripts y metadata. Revisa `scripts` para comandos de desarrollo (`start`, `build`, `lint`, `type-check`). Verifica dependencias clave: `expo`, `expo-router`, `@react-navigation/native`, `@supabase/supabase-js`, `react-native-reanimated`.
- `tsconfig.json` — configuración TypeScript. Controles de `strict`, paths (`baseUrl`, `paths`) y target. Importante para tipos y compatibilidad.
- `app.json` — configuración de Expo: slug, nombre, versión, expo-managed settings.
- `eslint.config.js` — reglas de linting específicas del repo.
- `expo-env.d.ts` — definiciones adicionales para Expo/TypeScript.

---

## `app/` — rutas y layouts (navegación)

- `app/_layout.tsx`:
  - Punto de entrada de la navegación.
  - Importa `ThemeProvider` de `@react-navigation/native` y decide `DarkTheme` vs `DefaultTheme` usando `use-color-scheme`.
  - Usa `AuthProvider` para exponer `useAuth()` globalmente.
  - `RootLayoutNav` usa `useSegments()` y `useRouter()` de `expo-router` para implementar redirecciones basadas en el estado de autenticación (`isAuthenticated`, `loading`).
  - Define un `Stack` con pantallas: `login`, `register`, `(tabs)` y `modal`.

- `app/login.tsx`:
  - Pantalla de inicio de sesión. Debe tener un formulario controlado que llama a `services/auth.service` o a métodos expuestos por `useAuth()`.
  - Maneja estados: `loading`, `error`. Tras login exitoso el contexto actualiza `isAuthenticated`.

- `app/register.tsx`:
  - Pantalla para registrar nuevos usuarios. Llama a la función `register` del `auth.service`.

- `app/modal.tsx`:
  - Pantalla presentada como modal (`presentation: 'modal'`). Utilizada para mostrar formularios o detalles sin cambiar la ruta base.

- `app/(tabs)/_layout.tsx`:
  - Layout para la sección de pestañas. Normalmente contiene un `Tabs` o `BottomTabNavigator` con las pantallas `index`, `map`, `trips`.

- `app/(tabs)/index.tsx`:
  - Pantalla principal dentro de las tabs. Podría ser el dashboard o listado resumen.

- `app/(tabs)/map.tsx`:
  - Muestra mapa con rutas o puntos. Interactúa con `use-trips` para mostrar tracks.

- `app/(tabs)/trips.tsx`:
  - Listado de viajes del usuario, con acciones para ver detalle, editar o crear nuevo viaje.

---

## `contexts/`

- `contexts/auth-context.tsx`:
  - Implementa `AuthProvider` y `useAuth()`.
  - Estado típico: `user: User | null`, `isAuthenticated: boolean`, `loading: boolean`.
  - En `useEffect` inicial puede restaurar sesión desde Supabase (`getSession()` o `onAuthStateChange`).
  - Provee funciones: `signIn`, `signOut`, `register` — que internamente llaman a `services/auth.service.ts`.
  - Detalles a buscar: manejo de tokens, actualización de `user` al cambiar sesión, limpieza de listeners al desmontar.

---

## `hooks/` — hooks personalizados

- `hooks/use-color-scheme.ts`:
  - Detecta el esquema de color del sistema (puede usar `Appearance` de React Native) y devuelve `'light'|'dark'`.

- `hooks/use-theme-color.ts`:
  - Función para mapear tokens de color (p. ej. `background`, `text`) sobre el `theme` de `@react-navigation/native`.

- `hooks/use-auth.ts`:
  - Hook que probablemente usa `useContext(AuthContext)` y expone `signIn`, `signOut`, `user`, `loading`.

- `hooks/use-trips.ts`:
  - Hook para gestionar los viajes: carga inicial (`fetchTrips`), creación (`createTrip`), actualización/eliminación y re-fetch.
  - Puede incluir soporte para paginación, filtros y suscripciones en tiempo real (Supabase Realtime).

- `hooks/use-user.ts`:
  - Hook para obtener/actualizar el perfil del usuario.

- `hooks/use-stats.ts`:
  - Calcula y devuelve estadísticas (distancia total, tiempo, promedio) llamando a `services/stats.service.ts`.

---

## `components/` y `components/ui/`

- `components/themed-view.tsx` y `components/themed-text.tsx`:
  - Wrappers sobre `View` y `Text` que consumen `useTheme()` para aplicar colores y estilos consistentes.

- `components/parallax-scroll-view.tsx`:
  - Implementa efecto parallax en encabezados al scrollear; puede usar `Animated` de RN o `react-native-reanimated`.

- `components/hello-wave.tsx`, `haptic-tab.tsx`, `external-link.tsx`:
  - Componentes específicos con lógica propia (ej. haptics al cambiar tab, abrir enlaces externos, animaciones).

- `components/ui/collapsible.tsx`:
  - Componente para secciones plegables; útil en detalles de viajes o filtros.

- `components/ui/icon-symbol.tsx` / `icon-symbol.ios.tsx`:
  - Manejo de iconografía; puede adaptar a plataforma iOS vs Android.

Recomendación: abrir cada componente y verificar si reciben `style` y `testID` para facilitar testing.

---

## `services/` — acceso a Supabase y lógica de negocio

- `services/supabase.ts`:
  - Inicializa y exporta el cliente Supabase (`createClient(SUPABASE_URL, SUPABASE_ANON_KEY)`).
  - Puede encapsular helper para `auth` y `from(table)`.

- `services/auth.service.ts`:
  - Envoltorio para funciones: `signInWithPassword`, `signOut`, `getUser`, `onAuthStateChange`.
  - Debe devolver errores interpretables y manejar casos de email no confirmado.

- `services/trip.service.ts`:
  - Funciones CRUD en la tabla `trips`: `createTrip(trip)`, `getTripsByUser(userId)`, `updateTrip(id, data)`, `deleteTrip(id)`.
  - Opcional: `subscribeToTrips(userId, callback)` usa Supabase Realtime para actualizar UI en vivo.

- `services/user.service.ts`:
  - Manejo de perfil: `getProfile(userId)`, `updateProfile(userId, data)`.

- `services/stats.service.ts`:
  - Consultas para agregados: sumatoria de distancias, promedios, etc. Pueden ser consultas SQL o funciones RPC en Supabase.

Buenas prácticas en servicios:
- Normalizar manejo de errores; retornar estructuras `{ data, error }` o lanzar excepciones controladas.
- Evitar lógica UI en servicios; mantenerlos puros y testeables.

---

## `supabase/schema.sql`

- Contiene el esquema de la base de datos: tablas (ej. `users`, `trips`, `profiles`), índices y claves foráneas.
- Revisar si hay políticas RLS (`CREATE POLICY`) — son esenciales para seguridad: ejemplo de policy `USING (auth.uid() = user_id)`.
- Buscar funciones SQL o vistas que sirvan para `stats` o cálculos complejos.

---

## `types/` — definiciones TypeScript

- `types/database.types.ts` — mapeos tipo tabla -> interfaces TS usadas por Supabase client.
- `types/trip.types.ts` — `Trip` interface: campos como `id`, `user_id`, `start_coords`, `end_coords`, `distance`, `duration`, `created_at`.
- `types/user.types.ts` — perfil: `id`, `email`, `display_name`, `avatar_url`, `metadata`.

Usar estos tipos en servicios y hooks mejora seguridad y DX.

---

## `assets/` — imágenes y recursos

- Toda imagen, logo y assets estáticos se encuentran en `assets/images/`.
- Recomendación: optimizar imágenes y usar tamaños apropiados para mobile.

---

## `scripts/`

- `scripts/reset-project.js` — script utilidad para resetear cachés o variables locales. Revisa su contenido antes de ejecutar.

---

## Flujo end-to-end (resumido)

1. Usuario abre app → `AuthProvider` intenta restaurar sesión.
2. Si no autenticado → `/login`.
3. Login → `auth.service.signIn` → contexto actualiza `user` y `isAuthenticated`.
4. Redirección a `/(tabs)` → usuario navega entre `map`, `trips`, etc.
5. Crear/Editar `trip` → `trip.service` actualiza DB → `use-trips` recarga o recibe evento en tiempo real.

---

## Preguntas de entrevista por sección (ejemplos extendidos)

- Autenticación & Seguridad:
  - ¿Cómo restaurar sesión al iniciar la app? Respuesta: usar `supabase.auth.getSession()` o listener global `onAuthStateChange` en `AuthProvider`.
  - ¿Cómo evitar que un usuario acceda a otro `trip`? Respuesta: RLS en Supabase y verificar `user_id` en queries del servicio.

- Arquitectura & Diseño:
  - ¿Por qué dividir `services` y `hooks`? Respuesta: separación de responsabilidades: `services` son I/O puras; `hooks` gestionan estado, efectos y caching.

- Performance:
  - ¿Cómo reducir re-renders en listas largas de `trips`? Respuesta: usar `FlatList` con `keyExtractor`, `getItemLayout`, memoizar items con `React.memo` y pasar `extraData` mínimo.

- Testing:
  - ¿Cómo testear `use-trips`? Respuesta: mockear `trip.service` con Jest y verificar llamadas y estados en distintos escenarios (success/error/loading).

---

## Ejercicios prácticos recomendados

- Añadir validación y manejo de errores en formularios de `login` y `register`.
- Implementar suscripción en tiempo real en `use-trips` para sincronizar cambios de DB.
- Añadir un endpoint o función RPC en Supabase para estadísticas complejas y consumirla desde `services/stats.service.ts`.

---

## Próximos pasos que puedo hacer por ti

- Comentar línea por línea un archivo crítico (recomiendo `contexts/auth-context.tsx` o `services/trip.service.ts`).
- Abrir y documentar cada archivo real en el repositorio con explicaciones línea por línea.
- Añadir tests de ejemplo para `use-trips`.

Dime cuál archivo quieres que comente línea por línea primero; empezaré con `contexts/auth-context.tsx` si estás de acuerdo.
