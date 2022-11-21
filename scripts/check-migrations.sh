set -o pipefail
git add .
git diff --exit-code HEAD > /dev/null
if [ $? -eq 1 ]; then
echo "
Changes to the schema must be saved as migrations.

Run npm run db:migrate:dev and follow the instructions to generate a new migration file.
Once you've done that, commit and push the changes."
exit 1
fi
