-- AlterTable
ALTER TABLE "chapters" ALTER COLUMN "image_url" DROP NOT NULL,
ADD COLUMN "logo_url" TEXT;
ALTER TABLE "chapters" RENAME COLUMN "image_url" TO "banner_url";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image_url" TEXT;
