# SIGERH Migrador - Documentación de API

Guía completa para desarrollar los servicios en el frontend `import-excel-frontend`.

## Información General

| Propiedad | Valor |
|-----------|-------|
| Base URL | `http://localhost/api` (desarrollo) |
| Autenticación | Bearer Token (Laravel Sanctum) |
| Content-Type | `application/json` (excepto uploads) |

---

## Endpoints Públicos (Sin Autenticación)

### 1. Health Check

Verifica que la API está funcionando.

```
GET /api/
```

**Response (200):**
```json
["Api is working"]
```

---

### 2. Login

Autentica un usuario y devuelve un token de acceso.

```
POST /api/login
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response Exitoso (200):**
```json
{
  "status": 200,
  "message": "",
  "error": false,
  "token": "1|abc123xyz789tokenlaravel",
  "user": "Juan Pérez",
  "email": "usuario@ejemplo.com",
  "role": "admin",
  "token_type": "Bearer"
}
```

**Response Error (401):**
```json
{
  "status": 401,
  "message": "Credenciales inválidas",
  "error": true,
  "token": "",
  "user": "",
  "email": "",
  "role": "",
  "token_type": "Bearer"
}
```

**Ejemplo con fetch:**
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (!data.error) {
    // Guardar token para futuras peticiones
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      name: data.user,
      email: data.email,
      role: data.role,
    }));
  }
  
  return data;
};
```

---

## Endpoints Protegidos (Requieren Autenticación)

Todos los siguientes endpoints requieren el header de autorización:

```
Authorization: Bearer {token}
```

---

### 3. Logout

Cierra la sesión del usuario actual e invalida el token.

```
POST /api/logout
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response (200):**
```json
{
  "message": "Logged out"
}
```

**Ejemplo con fetch:**
```typescript
const logout = async (token: string) => {
  const response = await fetch(`${API_URL}/api/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (response.ok) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  return response.json();
};
```

---

### 4. Crear Usuario

Crea un nuevo usuario en el sistema.

```
POST /api/user
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@ejemplo.com",
  "password": "Password123!"
}
```

**Validaciones:**
| Campo | Reglas |
|-------|--------|
| name | Requerido, string, máx 255 caracteres, único en tabla users |
| email | Requerido, string, email válido, máx 255 caracteres, único en tabla users |
| password | Requerido, debe cumplir reglas de seguridad de Laravel |

**Response Exitoso (200):**
```json
{
  "name": "Nuevo Usuario",
  "email": "nuevo@ejemplo.com",
  "id": 5,
  "role": ""
}
```

**Response Error de Validación (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

**Ejemplo con fetch:**
```typescript
const createUser = async (token: string, userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await fetch(`${API_URL}/api/user`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  return response.json();
};
```

---

### 5. Obtener Información del Usuario Actual

Devuelve la información del usuario autenticado.

```
GET /api/user
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "name": "Juan Pérez",
  "email": "usuario@ejemplo.com",
  "id": 1,
  "role": "admin"
}
```

**Ejemplo con fetch:**
```typescript
const getUserInfo = async (token: string) => {
  const response = await fetch(`${API_URL}/api/user`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};
```

---

### 6. Buscar Persona por Identificación (FUC)

Busca información de una persona en el sistema FUC por su número de identificación.

```
GET /api/people/find/{id}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Parámetros de URL:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | string | Número de identificación (carnet de identidad) |

**Response Exitoso (200) - Persona encontrada:**
```json
{
  "id": "12345678901",
  "primer_nombre": "Juan",
  "segundo_nombre": "Carlos",
  "primer_apellido": "Pérez",
  "segundo_apellido": "García",
  "sexo": "M",
  "identidad_numero": "85010112345",
  "direccion": "Calle 23 #456, Vedado, La Habana",
  "nacimiento_fecha": "1985-01-01"
}
```

**Response - Persona no encontrada (200):**
```json
{}
```

**Ejemplo con fetch:**
```typescript
const findPerson = async (token: string, identificationNumber: string) => {
  const response = await fetch(`${API_URL}/api/people/find/${identificationNumber}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
};
```

---

### 7. Migrar Persona Individual

Migra una persona específica por su ID.

```
POST /api/people/migrate
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "85010112345"
}
```

**Response (200):**
```json
// Sin contenido específico documentado
```

**Ejemplo con fetch:**
```typescript
const migratePerson = async (token: string, personId: string) => {
  const response = await fetch(`${API_URL}/api/people/migrate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: personId }),
  });
  
  return response.json();
};
```

---

### 8. Importar Personas desde Archivo Excel

Importa múltiples personas desde un archivo Excel (.xlsx o .xls).

```
POST /api/people/import
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| file | File | Archivo Excel (.xlsx, .xls) |

**Validaciones:**
- El archivo es requerido
- Debe ser un archivo válido
- Extensiones permitidas: `.xlsx`, `.xls`

**Response Exitoso (200):**
```json
{
  "success": true,
  "message": "Importacion satisfactoria",
  "errors": [],
  "importedRows": 150,
  "totalRows": 150
}
```

**Response con Errores Parciales (220):**
```json
{
  "success": false,
  "message": "Han ocurrido errores durante la importacion",
  "errors": [
    {
      "row": 5,
      "message": "El campo identificación es inválido"
    },
    {
      "row": 12,
      "message": "Persona ya existe en el sistema"
    }
  ],
  "importedRows": 148,
  "totalRows": 150
}
```

**Response Error de Validación (422):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "file": ["The file field is required."]
  }
}
```

**Response Error del Servidor (500):**
```json
{
  "message": "Stack trace del error..."
}
```

**Ejemplo con fetch:**
```typescript
const importPeopleFromFile = async (token: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/api/people/import`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // NO incluir Content-Type, el navegador lo establece automáticamente con boundary
    },
    body: formData,
  });
  
  return response.json();
};
```

**Ejemplo con Axios:**
```typescript
import axios from 'axios';

const importPeopleFromFile = async (token: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_URL}/api/people/import`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};
```

---

## Estructura de Datos de Persona

Cuando se importa o migra una persona, estos son los campos que el sistema maneja internamente:

```typescript
interface PersonData {
  first_name: string;           // Primer nombre
  middle_name: string;          // Segundo nombre
  last_name: string;            // Primer apellido
  second_last_name: string;     // Segundo apellido
  gender: number;               // 0 = Femenino, 1 = Masculino
  identification_number: string; // Número de carnet de identidad
  address: string;              // Dirección
  fuc_id: string;               // ID en el sistema FUC
  position_id: number;          // ID del cargo
  educational_level_id: number; // ID del nivel educacional
  contract_type_id: number;     // ID del tipo de contrato
  contract_start_date: string;  // Fecha inicio contrato (YYYY-MM-DD)
  contract_end_date: string | null; // Fecha fin contrato (YYYY-MM-DD)
  date_of_birth: string;        // Fecha de nacimiento (YYYY-MM-DD)
  migration_uuid: string;       // UUID de la migración
}
```

---

## Manejo de Errores

### Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 220 | Éxito parcial (importación con errores) |
| 401 | No autorizado (token inválido o expirado) |
| 422 | Error de validación |
| 500 | Error interno del servidor |

### Interceptor de Errores Recomendado

```typescript
// api/client.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost';

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Token expirado o inválido
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }
    
    // Error de validación
    if (response.status === 422) {
      const error = await response.json();
      throw { type: 'validation', errors: error.errors };
    }
    
    // Error del servidor
    if (response.status >= 500) {
      throw new Error('Error del servidor');
    }
    
    return response.json();
  },
  
  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  },
  
  post<T>(endpoint: string, data?: unknown) {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });
  },
};
```

---

## Ejemplo de Servicio Completo

```typescript
// services/api.ts
import { apiClient } from './client';

// Tipos
interface LoginResponse {
  status: number;
  message: string;
  error: boolean;
  token: string;
  user: string;
  email: string;
  role: string;
  token_type: string;
}

interface UserInfo {
  name: string;
  email: string;
  id: number;
  role: string;
}

interface ImportResponse {
  success: boolean;
  message: string;
  errors: Array<{ row: number; message: string }>;
  importedRows: number;
  totalRows: number;
}

interface PersonFuc {
  id: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido: string;
  sexo: 'M' | 'F';
  identidad_numero: string;
  direccion: string;
  nacimiento_fecha: string;
}

// Servicios
export const authService = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>('/api/login', { email, password }),
  
  logout: () =>
    apiClient.post<{ message: string }>('/api/logout'),
  
  getUserInfo: () =>
    apiClient.get<UserInfo>('/api/user'),
};

export const userService = {
  create: (data: { name: string; email: string; password: string }) =>
    apiClient.post<UserInfo>('/api/user', data),
};

export const peopleService = {
  find: (identificationNumber: string) =>
    apiClient.get<PersonFuc | {}>(`/api/people/find/${identificationNumber}`),
  
  migrate: (id: string) =>
    apiClient.post('/api/people/migrate', { id }),
  
  importFromFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<ImportResponse>('/api/people/import', formData);
  },
};
```

---

## Variables de Entorno Frontend

Configura estas variables en tu archivo `.env`:

```env
# URL base de la API (sin /api al final)
VITE_API_URL=http://localhost

# Para producción
# VITE_API_URL=https://tu-dominio.com
```

---

## Resumen de Endpoints

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| GET | `/api/` | No | Health check |
| POST | `/api/login` | No | Iniciar sesión |
| POST | `/api/logout` | Sí | Cerrar sesión |
| POST | `/api/user` | Sí | Crear usuario |
| GET | `/api/user` | Sí | Info usuario actual |
| GET | `/api/people/find/{id}` | Sí | Buscar persona en FUC |
| POST | `/api/people/migrate` | Sí | Migrar persona individual |
| POST | `/api/people/import` | Sí | Importar desde Excel |
