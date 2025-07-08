import { ReportAdapter } from "./ReportAdapter";
import { DirectoryReport } from "./DirectoryReport";

export class CsvReportAdapter implements ReportAdapter {
  export(report: DirectoryReport): string {
    const metrics = [
      "Metric,Value",
      `Total Files,${report.files}`,
      `Total Directories,${report.directories}`,
      `Total Size (bytes),${report.totalSize}`,
      "",
      "Extension,Count",
    ];

    const extStats = Object.entries(report.extensions).map(
      ([ext, count]) => `${ext},${count}`
    );

    return [...metrics, ...extStats].join("\n");
  }
}
