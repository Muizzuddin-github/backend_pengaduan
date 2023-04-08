-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `roles_role_key`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NULL,
    `tanggal_daftar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fk_role` INTEGER NOT NULL DEFAULT 2,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategori_pengaduan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(20) NOT NULL,
    `foto` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengaduan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `foto` VARCHAR(191) NOT NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `status` ENUM('terkirim', 'diproses', 'ditolak', 'selesai') NOT NULL DEFAULT 'terkirim',
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fk_kategori_pengaduan` INTEGER NOT NULL,
    `fk_user` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penanganan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `foto_bukti` VARCHAR(191) NULL,
    `deskripsi` TEXT NOT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fk_pengaduan` INTEGER NOT NULL,

    UNIQUE INDEX `penanganan_fk_pengaduan_key`(`fk_pengaduan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pelayanan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kritik` TEXT NOT NULL,
    `saran` TEXT NOT NULL,
    `fk_user` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_fk_role_fkey` FOREIGN KEY (`fk_role`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengaduan` ADD CONSTRAINT `pengaduan_fk_kategori_pengaduan_fkey` FOREIGN KEY (`fk_kategori_pengaduan`) REFERENCES `kategori_pengaduan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengaduan` ADD CONSTRAINT `pengaduan_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penanganan` ADD CONSTRAINT `penanganan_fk_pengaduan_fkey` FOREIGN KEY (`fk_pengaduan`) REFERENCES `pengaduan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pelayanan` ADD CONSTRAINT `pelayanan_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
