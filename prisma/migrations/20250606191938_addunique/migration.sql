/*
  Warnings:

  - A unique constraint covering the columns `[group_name]` on the table `groups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[groups] ADD CONSTRAINT [groups_group_name_key] UNIQUE NONCLUSTERED ([group_name]);

-- CreateIndex
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_username_key] UNIQUE NONCLUSTERED ([username]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
