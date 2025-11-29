# ✅ Checklist para Producción

## 🔧 Configuración Requerida

### 1. Variables de Entorno
- [ ] Actualizar `.env` con la URL del backend de producción
  ```bash
  VITE_API_URL="https://tu-api-produccion.com/api/"
  ```
- [ ] **IMPORTANTE**: Verificar que `.env` esté en `.gitignore` (ya configurado ✓)

### 2. Modo de Desarrollo - Gestión de Usuarios

#### ⚠️ CRÍTICO: Deshabilitar Modo Desarrollo

**Archivo: `src/providers/AuthProvider.tsx`**
- [ ] Cambiar `DEV_MODE = true` a `DEV_MODE = false` (línea ~18)
  ```typescript
  const DEV_MODE = false; // ⚠️ Cambiar a false para producción
  ```

**Archivo: `src/services/users.ts`**
- [ ] Cambiar `DEV_MODE = true` a `DEV_MODE = false` (línea ~3)
  ```typescript
  const DEV_MODE = false; // ⚠️ Cambiar a false para producción
  ```

### 3. Verificación de Endpoints del Backend

Asegúrate de que el backend tenga implementados los siguientes endpoints:

#### Autenticación
- `POST /api/token` - Login de usuario
- `POST /api/user` - Registro de usuario
- `POST /api/logout` - Cerrar sesión
- `GET /api/user` - Obtener datos del usuario actual

#### Gestión de Usuarios (requiere rol admin)
- `GET /api/users` - Listar todos los usuarios
- `GET /api/users/:id` - Obtener un usuario por ID
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### 4. Build y Despliegue

```bash
# Instalar dependencias
npm install

# Ejecutar linter
npm run lint

# Crear build de producción
npm run build

# Previsualizar build (opcional)
npm run preview
```

### 5. Verificaciones de Seguridad

- [ ] Verificar que `.env` no esté en el repositorio
- [ ] Confirmar que las credenciales de desarrollo no estén hardcodeadas
- [ ] Revisar que los tokens se almacenen de forma segura
- [ ] Validar que las rutas protegidas funcionen correctamente
- [ ] Probar el sistema de roles (admin/user)

### 6. Testing Pre-Producción

- [ ] Probar login con credenciales reales del backend
- [ ] Verificar que la gestión de usuarios funcione con la API real
- [ ] Probar creación, edición y eliminación de usuarios
- [ ] Validar que los permisos de admin funcionen correctamente
- [ ] Verificar que usuarios normales no puedan acceder a `/users`
- [ ] Probar la importación de archivos Excel
- [ ] Verificar el manejo de errores y mensajes

## 📝 Notas Importantes

### Datos Mock en Desarrollo
El proyecto actualmente usa datos mock para desarrollo en:
- **AuthProvider**: Usuario admin de prueba
- **users.ts**: Lista de usuarios de ejemplo

Estos datos NO se usarán en producción una vez que `DEV_MODE = false`.

### Estructura de Respuestas del Backend

El frontend espera las siguientes estructuras:

**Login/Register Response:**
```typescript
{
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    createdAt: string;
  },
  token: string;
}
```

**Users List Response:**
```typescript
{
  users: AuthUser[];
  total: number;
}
```

## 🚀 Pasos Finales

1. Cambiar `DEV_MODE` a `false` en ambos archivos mencionados
2. Actualizar `VITE_API_URL` en `.env`
3. Ejecutar `npm run build`
4. Desplegar la carpeta `dist/` en tu servidor
5. Configurar variables de entorno en el servidor de hosting

## ⚠️ Recordatorios

- **NO** subir el archivo `.env` al repositorio
- **NO** dejar `DEV_MODE = true` en producción
- Verificar que el backend esté funcionando antes del despliegue
- Probar todas las funcionalidades en un ambiente de staging primero
