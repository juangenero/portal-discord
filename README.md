# API

### config BD

1. npx prisma generate
   - Crear cliente Prisma
2. Comando para exportar DDL:
   - npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > init.sql
3. Comando para ejecutar el DDL en Turso (desde wsl):
   - turso db shell alcala-city < init.sql

-------------------- siguientes pasos --------------------

> code

- actualización manual de los datos de un usuario (incluye la gestión/reovación tokens discord)
- middleware para checkear roles de discord

> Investigar

# CLIENT

1. Refrescar estado usuario desde interceptor
2. Sistema de alertas
3. Control de errores robusto y (centralizado ?)
4. Skeleton en tabla sesiones activas
