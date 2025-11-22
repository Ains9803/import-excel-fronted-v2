# Excel Importer - Frontend

Aplicación web para importar y gestionar archivos Excel con validación de datos y autenticación de usuarios.

## 🚀 Características

- **Importación de archivos Excel** con validación en tiempo real
- **Autenticación de usuarios** (Login/Registro)
- **Interfaz moderna** con Tailwind CSS y componentes Radix UI
- **Validación de formularios** con React Hook Form y Zod
- **Gestión de estado** con Context API
- **Historial de archivos** importados
- **Descarga de plantillas** Excel
- **Drag & Drop** para subir archivos
- **Responsive design** optimizado para móviles y escritorio

## 🛠️ Tecnologías

- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Radix UI** - Componentes accesibles
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos

## 📋 Requisitos previos

- Node.js 18+ 
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd import-excel-fronted
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
# Crear archivo .env en la raíz del proyecto
VITE_API_URL=http://localhost:3000/api
```

## 🚀 Uso

### Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### Build de producción
```bash
npm run build
```

### Preview del build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── Import/          # Componentes de importación de Excel
│   ├── User/            # Componentes de autenticación
│   └── ui/              # Componentes UI reutilizables
├── contex/              # Context API (AuthContext)
├── services/            # Servicios API
├── types/               # Definiciones TypeScript
├── utils/               # Utilidades y helpers
└── App.tsx              # Componente principal
```

## 🔐 Autenticación

La aplicación incluye un sistema de autenticación con:
- Registro de nuevos usuarios
- Login con email y contraseña
- Gestión de sesión con tokens
- Protección de rutas

## 📊 Importación de Excel

Funcionalidades de importación:
- Validación de formato de archivo (.xlsx, .xls)
- Validación de tamaño máximo
- Preview de datos antes de importar
- Barra de progreso durante la carga
- Manejo de errores detallado
- Historial de archivos importados

## 🎨 Componentes UI

Componentes personalizados basados en Radix UI:
- Buttons
- Cards
- Inputs
- Selects
- Tabs
- Progress bars
- Alert dialogs
- Tables

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y de uso interno.

## 👥 Autor

Desarrollado con ❤️ para la gestión eficiente de datos Excel
