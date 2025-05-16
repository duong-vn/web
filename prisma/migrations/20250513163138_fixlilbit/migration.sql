BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[comments] (
    [comment_id] INT NOT NULL IDENTITY(1,1),
    [content] TEXT NOT NULL,
    [user_id] INT,
    [post_id] INT,
    [created_at] DATETIME CONSTRAINT [DF__comments__create__239E4DCF] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__comments__E7957687AC02D544] PRIMARY KEY CLUSTERED ([comment_id])
);

-- CreateTable
CREATE TABLE [dbo].[group_members] (
    [group_id] INT NOT NULL,
    [user_id] INT NOT NULL,
    [role] NVARCHAR(50) NOT NULL,
    [joined_at] DATETIME CONSTRAINT [DF__group_mem__joine__1A14E395] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [group_members_pkey] PRIMARY KEY CLUSTERED ([user_id],[group_id])
);

-- CreateTable
CREATE TABLE [dbo].[groups] (
    [group_id] INT NOT NULL IDENTITY(1,1),
    [group_name] NVARCHAR(255) NOT NULL,
    [created_by] INT,
    [number_of_posts] INT CONSTRAINT [DF__groups__number_o__145C0A3F] DEFAULT 0,
    [number_of_members] INT CONSTRAINT [DF__groups__number_o__15502E78] DEFAULT 0,
    [created_at] DATETIME CONSTRAINT [DF__groups__created___164452B1] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__groups__D57795A04E0C402C] PRIMARY KEY CLUSTERED ([group_id])
);

-- CreateTable
CREATE TABLE [dbo].[posts] (
    [post_id] INT NOT NULL IDENTITY(1,1),
    [content] TEXT NOT NULL,
    [user_id] INT,
    [group_id] INT,
    [created_at] DATETIME CONSTRAINT [DF__posts__created_a__1ED998B2] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__posts__3ED787665E7D32AB] PRIMARY KEY CLUSTERED ([post_id])
);

-- CreateTable
CREATE TABLE [dbo].[reactions] (
    [reaction_id] INT NOT NULL IDENTITY(1,1),
    [user_id] INT,
    [post_id] INT,
    [comment_id] INT,
    [reaction_type] NVARCHAR(50),
    [created_at] DATETIME CONSTRAINT [DF__reactions__creat__286302EC] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__reaction__36A9D2980440C72D] PRIMARY KEY CLUSTERED ([reaction_id])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B61E472AA0A] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateTable
CREATE TABLE [dbo].[users] (
    [user_id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(255) NOT NULL,
    [full_name] NVARCHAR(255) NOT NULL,
    [username] NVARCHAR(255) NOT NULL,
    [gender] NVARCHAR(10),
    [created_at] DATETIME CONSTRAINT [DF__users__created_a__117F9D94] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__users__B9BE370F4ADB77BF] PRIMARY KEY CLUSTERED ([user_id]),
    CONSTRAINT [UQ__users__AB6E6164ECD4F32E] UNIQUE NONCLUSTERED ([email])
);

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [FK__comments__post_i__25869641] FOREIGN KEY ([post_id]) REFERENCES [dbo].[posts]([post_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[comments] ADD CONSTRAINT [FK__comments__user_i__24927208] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([user_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[group_members] ADD CONSTRAINT [FK__group_mem__group__1B0907CE] FOREIGN KEY ([group_id]) REFERENCES [dbo].[groups]([group_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[group_members] ADD CONSTRAINT [FK__group_mem__user___1BFD2C07] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([user_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[groups] ADD CONSTRAINT [FK__groups__created___173876EA] FOREIGN KEY ([created_by]) REFERENCES [dbo].[users]([user_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[posts] ADD CONSTRAINT [FK__posts__group_id__20C1E124] FOREIGN KEY ([group_id]) REFERENCES [dbo].[groups]([group_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[posts] ADD CONSTRAINT [FK__posts__user_id__1FCDBCEB] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([user_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[reactions] ADD CONSTRAINT [FK__reactions__comme__2B3F6F97] FOREIGN KEY ([comment_id]) REFERENCES [dbo].[comments]([comment_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[reactions] ADD CONSTRAINT [FK__reactions__post___2A4B4B5E] FOREIGN KEY ([post_id]) REFERENCES [dbo].[posts]([post_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[reactions] ADD CONSTRAINT [FK__reactions__user___29572725] FOREIGN KEY ([user_id]) REFERENCES [dbo].[users]([user_id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
