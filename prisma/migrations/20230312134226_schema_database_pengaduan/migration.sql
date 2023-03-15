-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(20) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `status` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    `refresh_token` VARCHAR(191) NULL,
    `tanggal_daftar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kategori_pengaduan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(12) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pengaduan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `foto` VARCHAR(191) NOT NULL,
    `lokasi` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL,
    `status` ENUM('terkirim', 'diproses', 'ditolak', 'selesai') NOT NULL DEFAULT 'terkirim',
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fk_kategori_pengaduan` INTEGER NOT NULL,
    `fk_user` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Penanganan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `foto_bukti` VARCHAR(191) NULL,
    `deskripsi` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fk_pengaduan` INTEGER NOT NULL,

    UNIQUE INDEX `Penanganan_fk_pengaduan_key`(`fk_pengaduan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pelayanan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kritik` VARCHAR(191) NOT NULL,
    `saran` VARCHAR(191) NOT NULL,
    `fk_user` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pengaduan` ADD CONSTRAINT `Pengaduan_fk_kategori_pengaduan_fkey` FOREIGN KEY (`fk_kategori_pengaduan`) REFERENCES `Kategori_pengaduan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengaduan` ADD CONSTRAINT `Pengaduan_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Penanganan` ADD CONSTRAINT `Penanganan_fk_pengaduan_fkey` FOREIGN KEY (`fk_pengaduan`) REFERENCES `Pengaduan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pelayanan` ADD CONSTRAINT `pelayanan_fk_user_fkey` FOREIGN KEY (`fk_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;