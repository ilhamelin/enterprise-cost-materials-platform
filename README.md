# 📦 MaterialCost Enterprise

> **Plataforma SaaS de Gestión Administrativa de Materia Prima, Control Costo/Rendimiento y Generación de KPI/KRI Empresariales.**

![Vue 3](https://img.shields.io/badge/Vue.js-3.4-4fc08d?style=for-the-badge&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Zod](https://img.shields.io/badge/Validation-Zod-3068b7?style=for-the-badge&logo=zod&logoColor=white)
![Vitest](https://img.shields.io/badge/Testing-Vitest-782a99?style=for-the-badge&logo=vitest&logoColor=white)

---

## 📋 Resumen Ejecutivo

**MaterialCost Enterprise** es una solución integral diseñada para empleadores, gerentes financieros y administradores de planta. Permite controlar el inventario de materias primas, simular escenarios de variación de precios, auditar modificaciones de costos de manera inmutable, calcular automáticamente el **Punto de Reorden ($ROP$)**, desinfectar y escanear facturas con **OCR inteligente**, y exportar informes ejecutivos formateados para toma de decisiones directivas.

---

## ✨ Matriz de Funcionalidades Destacadas

### 📊 1. Control de Inventario & Tabla Interactiva
* **Edición en tiempo real:** Control de insumos, proveedores, cantidades, costo unitario, rendimiento porcentual y merma.
* **Insignias de Almacenamiento:** Clasificación automática de vida útil de lotes (*Hoy*, *Advertencia*, *Riesgo Degradación*).
* **Exportación Directa:** Descarga inmediata en formato **CSV / Excel** con 1-clic.

### 🔮 2. Simulador de Escenarios Financieros (*What-If Analysis & Monte Carlo*)
* Deslizadores interactivos para proyectar el impacto económico de alzas de precios en Metales, Plásticos o Mermas.
* Guardado y carga instantánea de **Plantillas de Simulación** (ej: *"Crisis Alza Metales +25%"*, *"Escenario Optimista"*).

### 📈 3. Generador de Indicadores KPI & KRI
* **KPIs de Rendimiento:** Margen de Beneficio Neto, Ratio de Eficiencia de Producción (*Yield Rate*), ROI de Insumos y Costo Total Directo.
* **KRIs de Riesgo:** Detección automática de mermas críticas ($> 5.0\%$) y evaluación de nivel de riesgo de proveedores.

### 📜 4. Bitácora de Auditoría Inmutable (*Audit Trail*)
* Trazabilidad completa de modificaciones: registra de forma transparente el usuario, rol, acción (`CREATE`, `UPDATE`, `DELETE`, `IMPORT`), insumo afectado, fecha y hora.

### 🔐 5. Control de Acceso Basado en Roles (RBAC)
* Conmutador interactivo entre 4 perfiles:
  1. `Administrador / Gerente General`: Permisos totales.
  2. `Jefe de Compras`: Registro de insumos, facturas y simulaciones.
  3. `Operador de Planta`: Edición restringida a mermas y cantidades.
  4. `Auditor Externo`: Acceso exclusivo de solo lectura (*Read-Only*).

### ⌨️ 6. Suite de Calidad de Vida (QoL)
* **Paleta de Comandos Omnipresente (`Ctrl + K` / `Cmd + K`):** Búsqueda y navegación veloz sin despegar las manos del teclado.
* **Calculadora de Reorden 1-Clic ($ROP$):** Detección de bajo stock y generación automática de órdenes de compra sugeridas.
* **Escáner OCR de Facturas:** Extracción e inyección automática de proveedor, cantidad y costo unitario desde documentos PDF cargados.

---

## 🛠️ Stack Tecnológico & Arquitectura

```
enterprise-cost-materials-platform/
├── backend/                             # Microservicio backend orientada a dominio (Node.js + TS)
│   ├── src/
│   │   ├── domain/
│   │   │   ├── models/                  # Interfaces de dominio (Financial, Audit, Simulation)
│   │   │   ├── schemas/                 # Validaciones estrictas Zod
│   │   │   └── services/                # Motores de cálculo (KPI/KRI, What-If, Reorder ROP, OCR)
│   │   └── presentation/                # Controladores HTTP/RPC con try-catch
│   └── tests/                           # Pruebas unitarias en Vitest
├── frontend/                            # Aplicación SPA Vue 3 + Composition API + TypeScript
│   ├── src/
│   │   ├── composables/                 # Composables reactivos (useEnterpriseMaterials, useRbac, useAuditTrail)
│   │   ├── components/                  # Componentes atómicos (Table, Charts, Simulator, CommandPalette, etc.)
│   │   └── style.css                    # Sistema de diseño Vanilla CSS (Glassmorphic dark design)
│   └── tests/                           # Pruebas UI con Vue Test Utils + Vitest
└── .github/workflows/deploy.yml         # GitHub Actions para despliegue automático en GitHub Pages
```

---

## 🚀 Guía de Instalación y Ejecución Local

### Prerrequisitos
* **Node.js**: v18.x o superior
* **npm**: v9.x o superior

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
cd TU_REPOSITORIO
```

### 2. Instalar dependencias e Iniciar Frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```
> La aplicación estará disponible en tu navegador en `http://localhost:3000`.

### 3. Ejecutar Pruebas Automatizadas (Vitest)
```bash
# Pruebas Unitarias Backend
cd ../backend
npm install
npm test

# Pruebas Unitarias Frontend
cd ../frontend
npm test
```

---

## 🌐 Guía de Despliegue en GitHub Pages

El proyecto incluye un flujo de trabajo listo para **GitHub Actions** (`.github/workflows/deploy.yml`) que compila y despliega automáticamente la aplicación al subir cambios a la rama principal (`main` o `master`).

### Pasos para publicar en GitHub Pages:

1. **Crear un nuevo repositorio en GitHub** (puedes nombrarlo `materialcost-enterprise`).
2. **Inicializar Git y conectar tu repositorio remoto:**
   ```bash
   cd C:\Users\benja\.gemini\antigravity-ide\scratch\enterprise-cost-materials-platform
   git init
   git add .
   git commit -m "feat: initial commit for MaterialCost Enterprise"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```
3. **Activar GitHub Pages en tu repositorio de GitHub:**
   - Ve a **Settings** > **Pages** en tu repositorio en GitHub.
   - En **Source**, selecciona **GitHub Actions**.
4. ¡Listo! Cada vez que realices un `git push`, GitHub Actions compilará la aplicación y la publicará automáticamente en:
   `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.
