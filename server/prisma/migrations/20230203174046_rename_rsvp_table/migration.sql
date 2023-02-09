-- AlterTable
ALTER TABLE "event_users" RENAME CONSTRAINT "event_users_rsvp_id_fkey" TO "event_users_attendance_id_fkey";
ALTER TABLE "event_users" RENAME COLUMN "rsvp_id" TO "attendance_id";
ALTER TABLE "rsvp" RENAME CONSTRAINT "rsvp_pkey" TO "attendance_pkey";
ALTER TABLE "rsvp" RENAME TO "attendance";
ALTER TABLE "rsvp_id_seq" RENAME TO "attendance_id_seq";

-- AlterIndex
ALTER INDEX "rsvp_name_key" RENAME TO "attendance_name_key";
