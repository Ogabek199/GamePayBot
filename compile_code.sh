#!/bin/bash
# Create the combined file
echo "# Project Source Code Compilation" > PROJECT_CODEBASE.md

# Iterate through files
find apps backend -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.cjs" -o -name "*.mjs" | grep -v "node_modules" | grep -v ".next" | grep -v ".git" | grep -v "dist" | while read -r file; do
    echo -e "\n## File: $file\n" >> PROJECT_CODEBASE.md
    echo "\`\`\`" >> PROJECT_CODEBASE.md
    cat "$file" >> PROJECT_CODEBASE.md
    echo -e "\n\`\`\`" >> PROJECT_CODEBASE.md
done
