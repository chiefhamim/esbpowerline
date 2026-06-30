-- CreateEnum
CREATE TYPE "GridSubscriptionPlan" AS ENUM ('NONE', 'PLAN_499', 'PLAN_999');

-- CreateEnum
CREATE TYPE "GridSubscriptionStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "MemberGridSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "GridSubscriptionPlan" NOT NULL DEFAULT 'NONE',
    "status" "GridSubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberGridSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberGridSubscription_userId_key" ON "MemberGridSubscription"("userId");

-- AddForeignKey
ALTER TABLE "MemberGridSubscription" ADD CONSTRAINT "MemberGridSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;