# portal-discord-api

# config BD

1. npx prisma init
2. configurar schema
3. npx prisma generate
4. npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > init.sql
5. (desde wsl) turso db shell alcala-city < init.sql
