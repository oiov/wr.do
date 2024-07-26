import { docsConfig } from "@/config/docs";
import { SearchCommand } from "@/components/dashboard/search-command";

export function DocsSearch() {
  return <SearchCommand links={docsConfig.sidebarNav} />;
}
