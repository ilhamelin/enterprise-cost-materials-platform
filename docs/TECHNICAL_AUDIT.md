# Auditoría Técnica y Revisión Crítica de Arquitectura

**Rol:** Principal Software Engineer & Cloud Architect  
**Proyecto:** Plataforma de Gestión Administrativa de Materia Prima y Análisis Costo/Rendimiento (`MaterialCost Enterprise`)

---

## 1. Análisis de Complejidad Algorítmica (Big O)

### 1.1 Motor de Simulación Financiera What-If (`SimulationEngine`)
* **Procesamiento de Escenarios de Estrés (`runSimulation`):**
  * **Complejidad Temporal:** $\mathcal{O}(N)$ en tiempo lineal estricto, donde $N$ es la cantidad de ítems en el catálogo de materia prima. Por cada insumo, el motor aplica multiplicadores de variación de precio y merma basándose en una consulta $\mathcal{O}(1)$ sobre un mapa Hash (`factorMap`).
  * **Complejidad Espacial:** $\mathcal{O}(F)$ donde $F$ es el número de factores de estrés por categoría configurados.

### 1.2 Motor de Cálculo de KPI & KRI (`KpiKriCalculator`)
* **Complejidad Temporal:** $\mathcal{O}(N)$ en tiempo lineal estricto para computar el Margen Neto, Yield Rate, ROI y generación de alertas KRI por exceso de mermas ($>5\%$).
* **Complejidad Espacial:** $\mathcal{O}(C + K)$ donde $C$ es el número de categorías únicas de insumos y $K$ es el número de alertas de riesgo KRI generadas.

---

## 2. Auditoría de Seguridad, RBAC y Bitácora de Auditoría (Audit Trail)

### 2.1 Control de Acceso Basado en Roles (RBAC)
* **Estructura de Permisos Implementada:**
  - `Administrador / Gerente`: Acceso total (lectura/escritura, eliminación, simulación, auditoría y reportes).
  - `Jefe de Compras`: Creación/Edición de insumos, simulación y carga de documentos (sin permiso de eliminación masiva).
  - `Operador de Planta`: Edición restringida a mermas y recepciones de insumos.
  - `Auditor Externo`: Acceso de solo lectura (*Read-Only*) con permisos para visualización de auditoría y exportación de reportes.

### 2.2 Bitácora de Auditoría Inmutable (Audit Trail)
* **Trazabilidad:** Cada acción destructiva o de modificación registra de manera inmutable:
  - `timestamp`: Marca temporal en milisegundos.
  - `userName` & `userRole`: Identificación del usuario y su rol activo.
  - `action`: Tipo de operación (`CREATE`, `UPDATE`, `DELETE`, `SIMULATE`, `IMPORT`).
  - `details`: Descripción detallada de los valores anteriores y nuevos.

---

## 3. Principios de Ingeniería de Software (SOLID)

* **Single Responsibility Principle (SRP):**
  - `RbacRoleSelector.vue`: Gestión del conmutador de perfil de usuario.
  - `ScenarioSimulator.vue`: Modelado de estrés financiero mediante deslizadores interactivos.
  - `CsvImporterModal.vue`: Proceso de carga masiva y vista previa pre-inserción.
  - `AuditTrailLog.vue`: Renderizado de la bitácora inmutable.
  - `NotificationCenter.vue`: Centro de alertas KRI en tiempo real.

---

## 4. Dictamen de Arquitectura Cloud de Alta Escala

> [!TIP]
> **Recomendación para Despliegue en Producción Cloud:**
> 1. **PostgreSQL con Prisma ORM**: Persistencia relacional de materias primas y tablas `audit_logs` con restricciones de inmutabilidad (`TRIGGER` que prohíba `UPDATE` o `DELETE` sobre la tabla de auditoría).
> 2. **AWS S3 con Signed URLs**: Almacenamiento seguro de documentos con URLs firmadas de corta duración.
> 3. **AWS Textract / Vision API**: Conexión real del endpoint de `SmartOcrParserService` para la extracción automática de datos desde archivos PDF subidos.
