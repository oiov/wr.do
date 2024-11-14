import {
  getScrapeStatsByTypeAndUserId,
  getScrapeStatsByUserId,
  getScrapeStatsByUserId1,
} from "@/lib/dto/scrape";

import { LineChartMultiple } from "../../admin/line-chart-multiple";
import { DailyPVUVChart } from "./daily-chart";
import LogsTable from "./logs";

export default async function DashboardScrapeCharts({ id }: { id: string }) {
  const screenshot_stats = await getScrapeStatsByTypeAndUserId(
    "screenshot",
    id,
  );
  const meta_stats = await getScrapeStatsByTypeAndUserId("meta-info", id);
  const md_stats = await getScrapeStatsByTypeAndUserId("markdown", id);
  const text_stats = await getScrapeStatsByTypeAndUserId("text", id);
  const all_logs = await getScrapeStatsByUserId1(id);

  return (
    <>
      <h2 className="my-1 text-xl font-semibold">Request Statistics</h2>
      {all_logs && all_logs.length > 0 && <DailyPVUVChart data={all_logs} />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(screenshot_stats.length > 0 || meta_stats.length > 0) && (
          <LineChartMultiple
            chartData={screenshot_stats.concat(meta_stats)}
            type1="screenshot"
            type2="meta-info"
          />
        )}
        {(md_stats.length > 0 || text_stats.length > 0) && (
          <LineChartMultiple
            chartData={md_stats.concat(text_stats)}
            type1="markdown"
            type2="text"
          />
        )}
      </div>
      <h2 className="my-1 text-xl font-semibold">Request Logs</h2>
      {all_logs && all_logs.length > 0 && <LogsTable userId={id} />}
    </>
  );
}
