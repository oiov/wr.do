import {
  getScrapeStatsByTypeAndUserId,
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
  const all_user_logs = await getScrapeStatsByUserId1(id);

  return (
    <>
      {all_user_logs && all_user_logs.length > 0 && (
        <DailyPVUVChart data={all_user_logs} />
      )}
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

      <LogsTable userId={id} target={"/api/v1/scraping/logs"} />
    </>
  );
}
