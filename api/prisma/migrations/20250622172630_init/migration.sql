-- CreateTable
CREATE TABLE "User" (
    "id_discord" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "avatar_hash" TEXT NOT NULL,
    "access_token_discord" TEXT,
    "iv_access_token_discord" TEXT,
    "refresh_token_discord" TEXT,
    "iv_refresh_token_discord" TEXT,
    "access_token_discord_expire" DATETIME,
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_user" TEXT NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "fecha_expiracion" DATETIME NOT NULL,
    "device_info" TEXT NOT NULL,
    "fecha_creacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" DATETIME NOT NULL,
    CONSTRAINT "Session_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User" ("id_discord") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sonido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "emoji" TEXT,
    "filename" TEXT NOT NULL,
    "file" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_refresh_token_hash_key" ON "Session"("refresh_token_hash");
