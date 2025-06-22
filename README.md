# API

## config BD

### Crear BD Turso

1. Configurar schema prisma

2. Generar migración inicial (genera dev.db local)

   > npx prisma migrate dev --name <nombre-migración>

3. Desde WSL, ejecutar el DDL en Turso:

   > turso db shell <nombre-bd> < prisma/migrations/<nombre-migración>/migration.sql

4. Generar cliente de prisma:

   > npx prisma generate

### Migrar BD Turso

1. Aplicar cambios necesarios en schema.prisma

2. Generar de forma local la migración, para tener la BD local sincronizada con los cambios realizados en turso:

   > npx prisma migrate dev --name <nombre-migración>

3. Desde WSL, ejecutar el script en Turso:

   > turso db shell <nombre-bd> < prisma/migrations/<nombre-migración>/migration.sql

4. Generar cliente prisma

   > npx prisma generate

-------------------- siguientes pasos --------------------

> code

- actualización manual de los datos de un usuario (incluye la gestión/reovación tokens discord)
- middleware para checkear roles de discord

> Investigar

# CLIENT

- Control de errores robusto y centralizado (TypeGuard) y ¿¿log local??
- Reorganizar carpetas / types
- Skeleton en tabla sesiones activas
