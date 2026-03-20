-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrer" TEXT,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactClick" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "contactType" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_username_idx" ON "PageView"("username");

-- CreateIndex
CREATE INDEX "PageView_username_timestamp_idx" ON "PageView"("username", "timestamp");

-- CreateIndex
CREATE INDEX "ContactClick_username_idx" ON "ContactClick"("username");
