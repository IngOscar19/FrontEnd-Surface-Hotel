# 🏨 Sistema de Gestión de Habitaciones y Reservas de Hotel

## 📋 Descripción

Sistema de Gestión de Habitaciones y Reservas de Hotel es una aplicación web completa desarrollada con Angular 19 que permite administrar de manera eficiente todas las operaciones relacionadas con las habitaciones y reservas de un hotel. El sistema está diseñado con una arquitectura basada en microservicios para garantizar escalabilidad y mantenibilidad.

## ✨ Características Principales

### Gestión de Habitaciones
- Crear, consultar, actualizar y eliminar habitaciones
- Administración de tipos de habitación, precios y características
- Control de disponibilidad en tiempo real
- Vista detallada de cada habitación

### Gestión de Reservas
- Realizar reservas de manera automatizada
- Consultar, modificar y cancelar reservas
- Calendario visual de reservas
- Verificación de disponibilidad para fechas específicas

### Administración de Usuarios
- Registro de huéspedes y personal del hotel
- Sistema de autenticación con JWT
- Diferentes niveles de acceso (Admin/Usuario)
- Guards de protección de rutas

### Panel de Administración
- Dashboard con estadísticas del hotel
- Vista de calendario interactivo
- Configuraciones del sistema
- Sidebar de navegación intuitivo

## 🚀 Tecnologías Utilizadas

- **Angular 19**: Framework principal
- **TypeScript**: Lenguaje de programación
- **RxJS**: Programación reactiva
- **JWT**: Autenticación y autorización
- **TailwindCSS**: Estilos personalizados
-**DaisyUI**: Componentes para diseño
- **Standalone Components**: Arquitectura modular

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: v20.0 o superior
- **npm**: v10.0.0 o superior
- **Angular CLI**: v19.0.0
  ```bash
  npm install -g @angular/cli@19
  ```

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd FrontHotel
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Edita el archivo en `src/enviroments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api', // URL de tu backend
     jwtKey: 'hotel_jwt_token'
   };
   ```

## 🏃‍♂️ Ejecución

### Modo Desarrollo
```bash
npm start
```
o
```bash
ng serve
```
La aplicación estará disponible en `http://localhost:4200`

### Build de Producción
```bash
ng build --configuration production
```
Los archivos compilados se generarán en el directorio `dist/`

## 🧪 Testing

### Ejecutar tests unitarios
```bash
ng test
```

### Ejecutar tests con cobertura
```bash
ng test --code-coverage
```

## 📁 Estructura del Proyecto

```
FrontHotel/
├── src/
│   ├── app/
│   │   ├── Usuarios/                    # Módulo de usuarios
│   │   │   ├── login/                   # Componente de login
│   │   │   └── register/                # Componente de registro
│   │   │
│   │   ├── admin/                       # Módulo de administración
│   │   │   ├── components/              # Componentes reutilizables del admin
│   │   │   │   ├── alert/              # Sistema de alertas
│   │   │   │   └── sidebar/            # Menú lateral
│   │   │   ├── layouts/                 # Layouts del admin
│   │   │   │   └── main-layout/        # Layout principal
│   │   │   ├── pages/                   # Páginas del panel admin
│   │   │   │   ├── calendar/           # Vista de calendario
│   │   │   │   ├── dashboard/          # Dashboard principal
│   │   │   │   ├── details-room/       # Detalles de habitación
│   │   │   │   ├── form-room/          # Formulario de habitación
│   │   │   │   ├── reserva/            # Crear/editar reserva
│   │   │   │   ├── reserva-list/       # Lista de reservas
│   │   │   │   ├── rooms-list/         # Lista de habitaciones
│   │   │   │   └── settings/           # Configuraciones
│   │   │   ├── services/                # Servicios del admin
│   │   │   │   ├── huesped.service.ts
│   │   │   │   ├── reservacion.service.ts
│   │   │   │   ├── room.service.ts
│   │   │   │   └── settings.service.ts
│   │   │   └── admin.routes.ts         # Rutas del admin
│   │   │
│   │   ├── core/                        # Funcionalidad central
│   │   │   ├── guards/                  # Guards de protección
│   │   │   │   ├── auth.guard.ts       # Protege rutas autenticadas
│   │   │   │   └── public.guard.ts     # Rutas públicas
│   │   │   ├── interceptors/            # Interceptores HTTP
│   │   │   │   └── auth.interceptor.ts # Añade token JWT
│   │   │   ├── interface/               # Interfaces TypeScript
│   │   │   │   ├── reserva.interface.ts
│   │   │   │   ├── room.interface.ts
│   │   │   │   └── settings.interface.ts
│   │   │   ├── models/                  # Modelos de datos
│   │   │   │   ├── auth-response.model.ts
│   │   │   │   ├── login.model.ts
│   │   │   │   └── user.model.ts
│   │   │   └── services/                # Servicios globales
│   │   │       ├── alert.service.ts
│   │   │       └── auth.service.ts
│   │   │
│   │   ├── features/                    # Características adicionales
│   │   │   └── auth/                    # Módulo de autenticación
│   │   │
│   │   ├── app.component.ts             # Componente raíz
│   │   ├── app.config.ts                # Configuración de la app
│   │   └── app.routes.ts                # Rutas principales
│   │
│   ├── enviroments/                     # Variables de entorno
│   ├── index.html                       # HTML principal
│   ├── main.ts                          # Punto de entrada
│   └── styles.css                       # Estilos globales
│
├── public/
│   └── favicon.ico
├── angular.json                         # Configuración de Angular
├── package.json                         # Dependencias del proyecto
├── tsconfig.json                        # Configuración de TypeScript
└── README.md
```

## 🔐 Autenticación y Seguridad

El sistema implementa un robusto sistema de autenticación:

### Flujo de Autenticación
1. El usuario inicia sesión a través de `/login`
2. El backend valida las credenciales y retorna un JWT token
3. El token se almacena en localStorage
4. El `AuthInterceptor` añade automáticamente el token a todas las peticiones HTTP
5. El `AuthGuard` protege las rutas del panel de administración
6. El `PublicGuard` previene el acceso a rutas públicas si ya está autenticado

### Guards Implementados
- **AuthGuard**: Protege rutas que requieren autenticación (ej: `/admin/*`)
- **PublicGuard**: Redirige usuarios autenticados desde páginas públicas (ej: login)

### Interceptores
- **AuthInterceptor**: Añade automáticamente el token JWT a las cabeceras de las peticiones

## 🌐 Servicios Principales

### AuthService
Gestiona la autenticación de usuarios:
- `login(credentials)`: Inicia sesión
- `register(userData)`: Registra nuevos usuarios
- `logout()`: Cierra sesión
- `isAuthenticated()`: Verifica si el usuario está autenticado
- `getToken()`: Obtiene el token JWT

### RoomService
Administra las habitaciones del hotel:
- `getRooms()`: Lista todas las habitaciones
- `getRoomById(id)`: Obtiene detalles de una habitación
- `createRoom(room)`: Crea una nueva habitación
- `updateRoom(id, room)`: Actualiza una habitación
- `deleteRoom(id)`: Elimina una habitación
- `checkAvailability(dates)`: Verifica disponibilidad

### ReservacionService
Gestiona las reservas:
- `getReservaciones()`: Lista todas las reservas
- `getReservacionById(id)`: Obtiene detalles de una reserva
- `createReservacion(reserva)`: Crea una nueva reserva
- `updateReservacion(id, reserva)`: Actualiza una reserva
- `cancelReservacion(id)`: Cancela una reserva

### HuespedService
Administra los huéspedes:
- `getHuespedes()`: Lista todos los huéspedes
- `getHuespedById(id)`: Obtiene información de un huésped
- `createHuesped(huesped)`: Registra un nuevo huésped
- `updateHuesped(id, huesped)`: Actualiza información del huésped

### SettingsService
Gestiona las configuraciones del sistema:
- `getSettings()`: Obtiene configuraciones actuales
- `updateSettings(settings)`: Actualiza configuraciones

### AlertService
Sistema de notificaciones al usuario:
- `success(message)`: Muestra alerta de éxito
- `error(message)`: Muestra alerta de error
- `warning(message)`: Muestra alerta de advertencia
- `info(message)`: Muestra alerta informativa

## 🎨 Rutas de la Aplicación

### Rutas Públicas
```typescript
/login          → Inicio de sesión
/register       → Registro de usuarios
```

### Rutas Protegidas (Admin)
```typescript
/admin/dashboard        → Panel principal con estadísticas
/admin/rooms-list       → Lista de habitaciones
/admin/form-room        → Crear/editar habitación
/admin/details-room/:id → Detalles de habitación
/admin/reserva-list     → Lista de reservas
/admin/reserva          → Crear/editar reserva
/admin/calendar         → Vista de calendario
/admin/settings         → Configuraciones del sistema
```

## 🎯 Convenciones de Código

### Nomenclatura
- **Componentes**: PascalCase para clases, kebab-case para selectores
  - Ejemplo: `LoginComponent` → selector: `app-login`
- **Servicios**: PascalCase con sufijo `Service`
  - Ejemplo: `AuthService`, `RoomService`
- **Interfaces**: PascalCase con sufijo `Interface`
  - Ejemplo: `RoomInterface`, `ReservaInterface`
- **Guards**: PascalCase con sufijo `Guard`
  - Ejemplo: `AuthGuard`, `PublicGuard`
- **Interceptors**: PascalCase con sufijo `Interceptor`
  - Ejemplo: `AuthInterceptor`

### Estructura de Archivos
```
nombre-componente/
├── nombre-componente.component.ts
├── nombre-componente.component.html
├── nombre-componente.component.css
└── nombre-componente.component.spec.ts
```

## 🔄 Flujo de Trabajo Típico

### Realizar una Reserva
1. Usuario accede al calendario o lista de habitaciones
2. Selecciona fechas y tipo de habitación
3. Sistema verifica disponibilidad en tiempo real
4. Usuario completa formulario con datos del huésped
5. Sistema crea la reserva y actualiza disponibilidad
6. Usuario recibe confirmación

### Gestionar Habitaciones
1. Admin accede a `/admin/rooms-list`
2. Puede ver todas las habitaciones con su estado
3. Crea nuevas habitaciones desde `/admin/form-room`
4. Edita habitaciones existentes
5. Visualiza detalles completos en `/admin/details-room/:id`


### Variables de Entorno para Producción
Edita `src/enviroments/environment.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-produccion.com/api',
  jwtKey: 'hotel_jwt_token'
};
```

## 🔧 Configuración del Backend

Este frontend está diseñado para trabajar con una API REST. Asegúrate de que tu backend esté configurado con los siguientes endpoints:

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Habitaciones
- `GET /api/rooms` - Listar habitaciones
- `GET /api/rooms/:id` - Obtener habitación
- `POST /api/rooms` - Crear habitación
- `PUT /api/rooms/:id` - Actualizar habitación
- `DELETE /api/rooms/:id` - Eliminar habitación

### Reservas
- `GET /api/reservaciones` - Listar reservas
- `GET /api/reservaciones/:id` - Obtener reserva
- `POST /api/reservaciones` - Crear reserva
- `PUT /api/reservaciones/:id` - Actualizar reserva
- `DELETE /api/reservaciones/:id` - Cancelar reserva

### Huéspedes
- `GET /api/huespedes` - Listar huéspedes
- `GET /api/huespedes/:id` - Obtener huésped
- `POST /api/huespedes` - Crear huésped
- `PUT /api/huespedes/:id` - Actualizar huésped


### El login no funciona
- Verifica que la URL del backend esté correcta en `environment.ts`
- Revisa que el backend esté corriendo
- Comprueba la consola del navegador para errores

### Las rutas protegidas no funcionan
- Asegúrate de que el token JWT se esté guardando correctamente
- Verifica que el `AuthInterceptor` esté configurado en `app.config.ts`
- Revisa que el `AuthGuard` esté aplicado a las rutas correctas

### Error de CORS
- Configura el backend para permitir peticiones desde `http://localhost:4200`
- Añade las cabeceras CORS apropiadas en el servidor

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT] - ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo Inicial* - [@tuusuario](https://github.com/tuusuario)

## 📞 Contacto

- Email: contacto@ejemplo.com
- GitHub: [Tu Repositorio](https://github.com/tuusuario/front-hotel)

---

**Última actualización**: Diciembre 2024 | **Versión**: 1.0.0 | **Angular**: 19.x