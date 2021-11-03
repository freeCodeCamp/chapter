set -o pipefail
git diff --exit-code HEAD | cat
if [ $? -eq 1 ]; then
echo "
Generated code must be commited.
If the above diff is of graphql.tsx you'll need run 'npm run gen'.
If it's anything else, a bit of investigation is required.

Once you've done that, you can commit the changes and all should be well."
exit 1
fi
