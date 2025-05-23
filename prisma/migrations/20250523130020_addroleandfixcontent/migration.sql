/*
  Warnings:

  - You are about to alter the column `content` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `NVarChar(Max)`.
  - You are about to drop the column `role` on the `group_members` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[comments] ALTER COLUMN [content] NVARCHAR(max) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[group_members] DROP COLUMN [role];

-- AlterTable
ALTER TABLE [dbo].[users] ADD [role] NVARCHAR(10);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
