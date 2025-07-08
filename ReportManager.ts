import { ReportAdapter } from './ReportAdapter';
import { JsonReportAdapter } from './JsonReportAdapter';
import { CsvReportAdapter } from './CsvReportAdapter';
import { XmlReportAdapter } from './XmlReportAdapter';
import { AnalyzerFacade } from './AnalyzerFacade';
import * as fs from 'fs';
import * as path from 'path';

export class ReportManager {
  private static readonly REPORTS_DIR = 'reports';
  private adapter: ReportAdapter;
  private fileExtension: string;
  private facade: AnalyzerFacade;

  constructor(format: string = 'json') {
    this.initReportsDirectory();
    [this.adapter, this.fileExtension] = this.getAdapter(format);
    this.facade = new AnalyzerFacade(this.adapter);
  }

  public generateReport(targetPath: string): void {
    try {
      const reportContent = this.facade.generateReport(targetPath);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `report-${timestamp}.${this.fileExtension}`;
      const filePath = path.join(ReportManager.REPORTS_DIR, filename);

      fs.writeFileSync(filePath, reportContent, 'utf-8');

      console.log(`Report generated successfully: ${filePath}`);
    } catch (error) {
      console.error('Error generating report:', (error as Error).message);
    }
  }

  private getAdapter(format: string): [ReportAdapter, string] {
    switch (format.toLowerCase()) {
      case 'json':
        return [new JsonReportAdapter(), 'json'];
      case 'csv':
        return [new CsvReportAdapter(), 'csv'];
      case 'xml':
        return [new XmlReportAdapter(), 'xml'];
      default:
        console.warn(`Unknown format "${format}". Falling back to JSON.`);
        return [new JsonReportAdapter(), 'json'];
    }
  }

  private initReportsDirectory(): void {
    if (!fs.existsSync(ReportManager.REPORTS_DIR)) {
      fs.mkdirSync(ReportManager.REPORTS_DIR, { recursive: true });
    }
  }
}
