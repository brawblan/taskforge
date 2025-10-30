-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "newValue" JSONB,
ADD COLUMN     "oldValue" JSONB;
