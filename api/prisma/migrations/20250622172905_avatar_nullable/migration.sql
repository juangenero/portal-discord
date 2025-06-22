-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id_discord" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "avatar_hash" TEXT,
    "access_token_discord" TEXT,
    "iv_access_token_discord" TEXT,
    "refresh_token_discord" TEXT,
    "iv_refresh_token_discord" TEXT,
    "access_token_discord_expire" DATETIME,
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" DATETIME NOT NULL
);
INSERT INTO "new_User" ("access_token_discord", "access_token_discord_expire", "avatar_hash", "fecha_actualizacion", "fecha_creacion", "id_discord", "iv_access_token_discord", "iv_refresh_token_discord", "refresh_token_discord", "username") SELECT "access_token_discord", "access_token_discord_expire", "avatar_hash", "fecha_actualizacion", "fecha_creacion", "id_discord", "iv_access_token_discord", "iv_refresh_token_discord", "refresh_token_discord", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
