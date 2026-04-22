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
}
