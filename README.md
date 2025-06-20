# API

## config BD

### Crear BD

1. npx prisma generate
   - Crear cliente Prisma
2. Comando para exportar DDL:
   - npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > init.sql
3. Comando para ejecutar el DDL en Turso (desde wsl):
   - turso db shell alcala-city < init.sql

### Migrar BD

- npx prisma generate
- npx prisma migrate diff --from-empty --to-schema-datamodel .\prisma\schema.prisma --script > init.sql
- npx prisma migrate dev --name init
- npx prisma db pull/push

- Turso DB -> https://turso.tech/
- Configuración Prisma -> https://www.youtube.com/watch?v=YX30LmRip6M

-------------------- siguientes pasos --------------------

> code

- actualización manual de los datos de un usuario (incluye la gestión/reovación tokens discord)
- middleware para checkear roles de discord

> Investigar

# CLIENT

- Control de errores robusto y centralizado (TypeGuard) y ¿¿log local??
- Reorganizar carpetas / types
- Skeleton en tabla sesiones activas
