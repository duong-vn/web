BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[groups] DROP CONSTRAINT [DF__groups__number_o__145C0A3F],
[DF__groups__number_o__15502E78];
ALTER TABLE [dbo].[groups] ADD CONSTRAINT [DF__groups__number_o__145C0A3F] DEFAULT 1 FOR [number_of_posts], CONSTRAINT [DF__groups__number_o__15502E78] DEFAULT 1 FOR [number_of_members];

-- AlterTable
ALTER TABLE [dbo].[posts] ADD [image] TEXT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
