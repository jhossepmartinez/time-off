/*
  Warnings:

  - You are about to drop the column `name` on the `Request` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "name",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'PENDING';
