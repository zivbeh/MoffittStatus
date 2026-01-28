-- AlterTable
ALTER TABLE `rating` MODIFY `libraryName` VARCHAR(255) NOT NULL,
    MODIFY `floor` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `name` VARCHAR(255) NULL;
