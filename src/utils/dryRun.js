import { spawnSync } from "child_process";

console.log("\n🔍 Starting Dry Run: Validating Feature Files and Step Definitions...\n");

const result = spawnSync("npm", ["run", "test:raw", "--silent", "--", "--dry-run", "--format", "summary"], {
  stdio: "inherit",
  shell: true
});

if (result.status === 0) {
  console.log("\n✅ Dry Run Successful: All steps are correctly mapped!\n");
} else {
  console.log("\n❌ Dry Run Failed: Please check the errors above.\n");
  process.exit(1);
}
