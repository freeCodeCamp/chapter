-- CreateTable
-- We aren't generating ids automatically, because the instance will use one record.
-- But we allow for multiple record, because we can add the ability for instance owner,
-- to save multiple settings, and use them as templates.
CREATE TABLE "instance_settings" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "policy_url" TEXT,
    "terms_of_services_url" TEXT,
    "code_of_conduct_url" TEXT,
    "font_style" TEXT,

    CONSTRAINT "instance_settings_pkey" PRIMARY KEY ("id")
);
