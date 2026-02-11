# 🚀 Template Fullstack: React + Java Spring Boot

¡Bienvenido! Este es un proyecto template fullstack diseñado para desarrolladores junior que quieren aprender cómo construir aplicaciones web modernas con React y Java Spring Boot.

## 📋 Descripción del Proyecto

Esta es una aplicación de autenticación completa con:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Java 17 + Spring Boot + Maven + H2 Database
- **Autenticación**: Sistema de login y registro con JWT
- **Base de datos**: H2 en memoria (para desarrollo)
- **UI/UX**: Diseño moderno y responsivo

## 🗂️ Estructura del Proyecto

```
template-react-java-fullstack/
├── apps/
│   ├── backend/          # Servidor Java Spring Boot
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── java/
│   │   │   │   │   └── com/example/authbackend/
│   │   │   │   │       ├── controller/
│   │   │   │   │       ├── service/
│   │   │   │   │       ├── repository/
│   │   │   │   │       ├── model/
│   │   │   │   │       ├── dto/
│   │   │   │   │       └── config/
│   │   │   │   └── resources/
│   │   │   │       └── application.properties
│   │   │   └── test/
│   │   ├── pom.xml       # Configuración Maven
│   │   └── Dockerfile
│   └── frontend/         # Aplicación React
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── hooks/
│       │   ├── context/
│       │   └── services/
│       ├── index.html
│       └── package.json
├── docker-compose.yml
└── README.md
```

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 19**: Biblioteca principal de UI
- **TypeScript**: Tipado estático
- **Vite**: Herramienta de build y desarrollo
- **React Router**: Manejo de rutas
- **Tailwind CSS**: Framework de CSS
- **pnpm**: Gestor de paquetes

### Backend

- **Java 17**: Lenguaje de programación principal
- **Spring Boot 3.2**: Framework de aplicaciones Java
- **Spring Data JPA**: Acceso a datos y ORM
- **Spring Security**: Autenticación y autorización
- **H2 Database**: Base de datos en memoria para desarrollo
- **Maven**: Gestor de dependencias y build
- **JWT (JJWT)**: Tokens de autenticación
- **BCrypt**: Hashing de contraseñas

## � Docker (Opcional)

### Usar Docker Compose para Desarrollo

```bash
# Iniciar ambos servicios con Docker
docker-compose up --build

# Detener los servicios
docker-compose down

# Reconstruir y empezar
docker-compose up --build --force-recreate
```

### Construir Imágenes Individuales

```bash
# Backend
cd apps/backend
docker build -t example-auth-backend .

# Frontend
cd apps/frontend
docker build -t example-auth-frontend .
```

### Docker para Producción

```bash
# Usar el stage de producción
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Java 17 o superior
- Maven 3.6+
- Node.js (v18 o superior)
- pnpm (recomendado) o npm
- Docker y Docker Compose (opcional)

### 1. Instalar Dependencias

```bash
# Frontend
cd apps/frontend
pnpm install

# Backend (las dependencias se descargan automáticamente con Maven)
cd apps/backend
mvn dependency:resolve
```

### 2. Ejecutar las Aplicaciones

```bash
# Backend (en una terminal)
cd apps/backend
mvn spring-boot:run
# → Corre en http://localhost:3000

# Frontend (en otra terminal)
cd apps/frontend
pnpm run dev
# → Corre en http://localhost:5173
```

## 📚 Guía para Desarrolladores Junior

### ¿Cómo funciona la aplicación?

1. **Registro**: Los usuarios crean una cuenta con email, nombre y contraseña
2. **Login**: Los usuarios inician sesión y reciben un token JWT válido
3. **Dashboard**: Vista protegida que muestra información del usuario

### Flujo de Autenticación

```
Usuario → Frontend → Backend → Base de datos (H2) → Backend → Frontend → Usuario
```

### Componentes Principales del Frontend

- **AuthProvider**: Contexto de React para manejar el estado de autenticación
- **Login/Register**: Formularios de autenticación
- **Dashboard**: Página protegida
- **Routes**: Configuración de rutas públicas y privadas

### Endpoints del Backend

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/health` - Verificar estado del servidor

### Arquitectura del Backend

- **Controller**: Maneja las peticiones HTTP
- **Service**: Contiene la lógica de negocio
- **Repository**: Acceso a datos con Spring Data JPA
- **Model**: Entidades de la base de datos
- **DTO**: Objetos de transferencia de datos
- **Config**: Configuración de seguridad y CORS

## ⚠️ **IMPORTANTE: Esto es solo una base**

Este proyecto es un **template educativo**. Para producción necesitas implementar:

### 🔐 Mejoras de Seguridad para Producción

- [ ] **Base de datos persistente** (PostgreSQL, MySQL, etc.)
- [ ] **JWT tokens** con configuración de expiración más robusta
- [ ] **Variables de entorno** para secrets y JWT key
- [ ] **Validación de inputs** más robusta con Bean Validation
- [ ] **Rate limiting** para prevenir ataques
- [ ] **HTTPS obligatorio** en producción
- [ ] **Logs y auditoría** de eventos de seguridad

### 🗄️ Configuración de Base de Datos para Producción

```yaml
# application.yml para producción
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/authdb
    username: ${DB_USERNAME:authuser}
    password: ${DB_PASSWORD:secretpassword}
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

  security:
    jwt:
      secret: ${JWT_SECRET:your-very-secure-secret-key-here}
      expiration: 86400000 # 24 horas
```

```java
// Ejemplo de configuración con variables de entorno
@Value("${spring.security.jwt.secret}")
private String jwtSecret;

@Value("${spring.security.jwt.expiration}")
private long jwtExpiration;
```

### 🚀 Características Faltantes

- [ ] **Recuperación de contraseña**
- [ ] **Verificación de email**
- [ ] **Perfil de usuario editable**
- [ ] **Logout real** (invalidar tokens)
- [ ] **Roles y permisos**
- [ ] **Logs y auditoría**
- [ ] **Tests unitarios y de integración**
- [ ] **Dockerización**
- [ ] **CI/CD pipeline**

### 📊 Mejoras de Performance

- [ ] **Caching** (Redis)
- [ ] **CDN** para assets estáticos
- [ ] **Lazy loading** de componentes
- [ ] **Optimización de bundle**
- [ ] **Service Worker** para PWA

## 🐛 Problemas Comunes y Soluciones

### "Port already in use"

```bash
# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9
```

### "pnpm command not found"

```bash
# Instalar pnpm
npm install -g pnpm
```

### Error de CORS

Asegúrate que el backend tenga el middleware CORS configurado.

## 🎯 Próximos Pasos Recomendados

1. **Aprender sobre bases de datos SQL/NoSQL**
2. **Estudiar JWT y autenticación moderna**
3. **Implementar validación con Bean Validation**
4. **Agregar tests con JUnit y Mockito**
5. **Configurar despliegue en producción**
6. **Aprender sobre microservicios con Spring Cloud**

## 📖 Recursos de Aprendizaje

- [React Documentation](https://react.dev/)
- [Spring Boot Official Guide](https://spring.io/guides/gs/spring-boot/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [Maven Documentation](https://maven.apache.org/guides/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Baeldung Spring Tutorials](https://www.baeldung.com/spring-boot)

## 🤝 Contribuciones

¡Este es un proyecto educativo! Si encuentras errores o tienes sugerencias, siéntete libre de abrir un issue o hacer un pull request.

## 📄 Licencia

MIT License - puedes usar este proyecto para aprender y construir tus propias aplicaciones.

---

**Recuerda**: Este es solo el comienzo. La programación web es un campo vasto y emocionante. ¡Sigue aprendiendo y construyendo! 🚀
