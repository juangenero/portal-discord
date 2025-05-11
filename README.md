# portal-discord-api

# config BD

1. npx prisma init -> Crea la estructura del esquema por defecto
2. configurar schema -> Crear tablas
3. npx prisma generate -> Crear cliente Prisma
4. Comando para exportar DDL:
   > npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > init.sql
5. Comando para ejecutar el DDL en Turso (desde wsl):
   > turso db shell alcala-city < init.sql
