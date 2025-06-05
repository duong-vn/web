/*
  Warnings:

  - You are about to alter the column `image` on the `groups` table. The data in that column could be lost. The data in that column will be cast from `Text` to `NVarChar(Max)`.
  - You are about to alter the column `description` on the `groups` table. The data in that column could be lost. The data in that column will be cast from `Text` to `NVarChar(Max)`.
  - You are about to alter the column `content` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `NVarChar(Max)`.
  - You are about to alter the column `image` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `NVarChar(Max)`.
  - You are about to alter the column `image` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `NVarChar(Max)`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[groups] ALTER COLUMN [image] NVARCHAR(max) NULL;
ALTER TABLE [dbo].[groups] ALTER COLUMN [description] NVARCHAR(max) NULL;

-- AlterTable
ALTER TABLE [dbo].[posts] ALTER COLUMN [content] NVARCHAR(max) NOT NULL;
ALTER TABLE [dbo].[posts] ALTER COLUMN [image] NVARCHAR(max) NULL;

-- AlterTable
ALTER TABLE [dbo].[users] ALTER COLUMN [image] NVARCHAR(max) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
