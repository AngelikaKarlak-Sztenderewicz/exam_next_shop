/*
  Warnings:

  - Added the required column `productImageUrl` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "productImageUrl" TEXT NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL;
