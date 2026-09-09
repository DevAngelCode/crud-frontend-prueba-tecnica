# CRUD Frontend
Frontend Angular del CRUD de clientes.

## Stack

- Angular 19 (standalone components)
- Bootstrap 5 + Bootstrap Icons
- SweetAlert2

## Requisitos

- Node.js 22+
- Angular CLI: `npm install -g @angular/cli`

## Instalación

```bash
npm install
```

## Servidor de desarrollo

```bash
ng serve
```

Abre `http://localhost:4200`. El backend debe estar corriendo en `http://localhost:8080`.

## Build

```bash
ng build
```

## Rutas

| Ruta | Descripción |
|---|---|
| `/customers` | Listado paginado con búsqueda por código |
| `/customers/new` | Crear cliente |
| `/customers/:id` | Ver detalle |
| `/customers/:id/edit` | Editar cliente |

## Funcionalidades

- Paginación en el backend (parámetros `page` y `size`)
- Búsqueda por `customerId` en todo el dataset
- Confirmaciones y avisos con SweetAlert2
- Diseño responsive