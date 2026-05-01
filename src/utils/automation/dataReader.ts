import fs from "fs";
import path from "path";

export class DataReader {
  /**
   * Reads a JSON file and returns the parsed data.
   * @param fileName Name of the file in src/tests/data/
   */
  static readJson(fileName: string): any {
    const filePath = path.resolve(process.cwd(), "src", "tests", "data", fileName);
    const rawData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(rawData);
  }

  /**
   * Reads a CSV file and returns an array of objects.
   * Assumes the first row is the header.
   * @param fileName Name of the file in src/tests/data/
   */
  static readCsv(fileName: string): any[] {
    const filePath = path.resolve(process.cwd(), "src", "tests", "data", fileName);
    const rawData = fs.readFileSync(filePath, "utf-8");
    const lines = rawData.split("\n").filter((line) => line.trim() !== "");
    const headers = lines[0].split(",");
    const results = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(",");
      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].trim()] = currentLine[j]?.trim();
      }
      results.push(obj);
    }

    return results;
  }

  /**
   * Runs a Data-Driven Test loop with automatic screenshot capture.
   * @param data Array of records to iterate over
   * @param world The Cucumber World instance (provides attach/page)
   * @param logic Callback containing the test logic for each record
   */
  static async runDDT(
    data: any[],
    world: any,
    logic: (record: any, index: number) => Promise<void>
  ): Promise<void> {
    const screenshotDir = path.resolve(process.cwd(), "test-results", "screenshots");
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      // Execute the test logic for this record
      await logic(record, i);

      // Capture screenshot after iteration logic
      if (world.page) {
        const timestamp = new Date().getTime();
        const screenshotName = `iteration_${i + 1}_${timestamp}.png`;
        const screenshotPath = path.join(screenshotDir, screenshotName);

        const screenshot = await world.page.screenshot({
          path: screenshotPath,
        });

        // Attach to Cucumber report
        await world.attach(screenshot, "image/png");
        console.log(`  📸 Screenshot saved: ${screenshotName}`);
      }
    }
  }
}
