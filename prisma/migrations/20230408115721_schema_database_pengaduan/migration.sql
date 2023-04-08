/*
  Warnings:

  - You are about to drop the `pelayanan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pelayanan` DROP FOREIGN KEY `pelayanan_fk_user_fkey`;

-- DropForeignKey
ALTER TABLE `penanganan` DROP FOREIGN KEY `penanganan_fk_pengaduan_fkey`;

-- DropForeignKey
ALTER TABLE `pengaduan` DROP FOREIGN KEY `pengaduan_fk_kategori_pengaduan_fkey`;

-- DropTable
DROP TABLE `pelayanan`;

-- CreateTable
CREATE TABLE `kritik_saran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kritik` TEXT NOT NULL,
    `saran` TEXT NOT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fk_user` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pengaduan` ADD CONSTRAINT `pengaduan_fk_kategori_pengaduan_fkey` FOREIGN KEY (`fk_kategori_pengaduan`) REFERENCES `kategori_pengaduan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penanganan` ADD CONSTRAINT `penanganan_fk_pengaduan_fkey` FOREIGN KEY (`fk_pengaduan`) REFERENCES `pengaduan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kritik_saran` ADD CONSTRAINT `kritik_saran_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
