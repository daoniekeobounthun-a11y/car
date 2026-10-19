/*
  Warnings:

  - You are about to drop the column `discount` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Booking` table. All the data in the column will be lost.
  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `categoryId` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceExpiry` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `seats` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `taxExpiry` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `transmission` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Car` table. All the data in the column will be lost.
  - The `status` column on the `Car` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `address` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `blacklistReason` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `transactionRef` on the `Payment` table. All the data in the column will be lost.
  - The `status` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `CarCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GpsTracking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaintenanceRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehicleCheck` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `method` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Car" DROP CONSTRAINT "Car_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "GpsTracking" DROP CONSTRAINT "GpsTracking_carId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceRecord" DROP CONSTRAINT "MaintenanceRecord_carId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceRecord" DROP CONSTRAINT "MaintenanceRecord_userId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleCheck" DROP CONSTRAINT "VehicleCheck_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleCheck" DROP CONSTRAINT "VehicleCheck_carId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleCheck" DROP CONSTRAINT "VehicleCheck_inInspectorId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleCheck" DROP CONSTRAINT "VehicleCheck_outInspectorId_fkey";

-- DropIndex
DROP INDEX "Customer_email_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "discount",
DROP COLUMN "updatedAt",
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "categoryId",
DROP COLUMN "imageUrl",
DROP COLUMN "insuranceExpiry",
DROP COLUMN "seats",
DROP COLUMN "taxExpiry",
DROP COLUMN "transmission",
DROP COLUMN "updatedAt",
DROP COLUMN "year",
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "address",
DROP COLUMN "blacklistReason",
DROP COLUMN "email",
DROP COLUMN "photoUrl",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "transactionRef",
DROP COLUMN "method",
ADD COLUMN     "method" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone",
DROP COLUMN "updatedAt",
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'STAFF';

-- DropTable
DROP TABLE "CarCategory";

-- DropTable
DROP TABLE "GpsTracking";

-- DropTable
DROP TABLE "Invoice";

-- DropTable
DROP TABLE "MaintenanceRecord";

-- DropTable
DROP TABLE "VehicleCheck";

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "CarStatus";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "Role";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
