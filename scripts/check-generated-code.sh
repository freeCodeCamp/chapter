git diff --quiet HEAD
if [ $? -eq 1 ]; then
echo "Generated code must be commited. Please run 'npm run gen' and add another commit."
exit 1
fi
