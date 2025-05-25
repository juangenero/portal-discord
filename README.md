# portal-discord-api

# config BD

1. npx prisma generate
   - Crear cliente Prisma
2. Comando para exportar DDL:
   - npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > init.sql
3. Comando para ejecutar el DDL en Turso (desde wsl):
   - turso db shell alcala-city < init.sql

-------------------- siguientes pasos --------------------

                     ---- code ----

- endpoint recuperar sesiones / cerrar las activas by ID sesion/usuario
- actualización manual de los datos de un usuario (incluye la gestión/reovación tokens discord)

                  ---- investigar ----

- frontend/backend mismo proyecto ¿despliegue posible?
- autorización con roles de discord en cada petición?
- react / astro / mixed ?
