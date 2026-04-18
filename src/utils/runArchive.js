import { archiveReports } from "./archiveReports.js";

try {
    archiveReports();
} catch (error) {
    console.error("Failed to archive reports:", error.message);
    process.exit(1);
}
