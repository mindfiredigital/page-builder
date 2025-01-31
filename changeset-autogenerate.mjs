import { execSync } from "child_process";
import fs from "fs";

// Get the most recent commit message
const commitMessage = execSync("git log -1 --format=%s").toString().trim();

// Define regex patterns
const commitPatterns = {
  major: /^BREAKING CHANGE: (.+)/,
  minor: /^feat\((.+)\): (.+)/,
  patch: /^fix\((.+)\): (.+)/
};

// Identify type, package, and description
let packageName = null;
let changeType = null;
let description = null;

if (commitPatterns.major.test(commitMessage)) {
  changeType = "major";
  description = commitMessage.match(commitPatterns.major)?.[1];
} else if (commitPatterns.minor.test(commitMessage)) {
  changeType = "minor";
  packageName = commitMessage.match(commitPatterns.minor)?.[1];
  description = commitMessage.match(commitPatterns.minor)?.[2];
} else if (commitPatterns.patch.test(commitMessage)) {
  changeType = "patch";
  packageName = commitMessage.match(commitPatterns.patch)?.[1];
  description = commitMessage.match(commitPatterns.patch)?.[2];
}

// Ensure package name is valid
if (packageName) {
  packageName = packageName.trim();
  description = description?.trim() || "No description provided.";

  // Generate changeset content
  const changesetContent = `---
'@mindfiredigital/page-builder-${packageName}': ${changeType}
---
${description}
`;

  // Write to a changeset file
  fs.writeFileSync(`.changeset/auto-${Date.now()}.md`, changesetContent);
  console.log("✅ Changeset file created based on the latest commit!");
} else {
  console.log("⚠️ No valid package found in the latest commit message, skipping changeset.");
}
