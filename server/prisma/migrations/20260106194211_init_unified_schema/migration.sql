/*
  Warnings:

  - You are about to drop the column `createdAt` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `graduationYear` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `alumni` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `alumni` table. All the data in the column will be lost.
  - Added the required column `birth_date` to the `alumni` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `alumni` table without a default value. This is not possible if the table is not empty.
  - Added the required column `graduation_year` to the `alumni` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `alumni` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `alumni` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "alumni" DROP COLUMN "createdAt",
DROP COLUMN "graduationYear",
DROP COLUMN "name",
DROP COLUMN "profilePicture",
DROP COLUMN "updatedAt",
ADD COLUMN     "address_complement" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "graduation_year" INTEGER NOT NULL,
ADD COLUMN     "linkedin_url" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "preferred_name" TEXT,
ADD COLUMN     "profile_picture" TEXT,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "skills" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
