-- CreateTable
CREATE TABLE "instance_settings" (
    "id" INTEGER NOT NULL,
    "description" TEXT,
    "policy_url" TEXT,
    "terms_of_services_url" TEXT,
    "code_of_conduct_url" TEXT,
    "font_style" TEXT,

    CONSTRAINT "instance_settings_pkey" PRIMARY KEY ("id")
);
