/*
  Warnings:

  - Added the required column `aiOutput` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `criteriaA` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `criteriaB` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `criteriaC` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `criteriaD` to the `Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "aiOutput" TEXT NOT NULL,
ADD COLUMN     "criteriaA" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "criteriaB" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "criteriaC" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "criteriaD" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "averageBand" DOUBLE PRECISION NOT NULL DEFAULT 0;
