import * as fs from "fs";
import * as path from "path";
import { DirectoryReport } from "./DirectoryReport";

export class DirectoryAnalyzer {
  analyze(dirPath: string): DirectoryReport {
    let files = 0;
    let directories = 0;
    let totalSize = 0;
    const extensions: Record<string, number> = {};

    const walk = (currentPath: string) => {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          directories++;
          walk(fullPath);
        } else if (entry.isFile()) {
          files++;
          const ext = path.extname(entry.name) || "no_extension";
          extensions[ext] = (extensions[ext] || 0) + 1;
          totalSize += fs.statSync(fullPath).size;
        }
      }
    };

    walk(dirPath);

    return {
      files,
      directories,
      totalSize,
      extensions,
    };
  }
}
