import { PageHeader } from "@/components/layout/page-header";
import { AppsExplorer } from "@/components/webapp/apps-explorer";
import * as data from "@/lib/data";

export const metadata = { title: "웹앱" };

export default function AppsPage({ searchParams }: { searchParams: { q?: string } }) {
  const apps = data.getWebApps();
  const categories = data.getCategories();
  const favorites = data.getFavorites();

  return (
    <div>
      <PageHeader title="스마트워크 웹앱" description="필요한 웹앱을 검색하고 바로 실행하세요." />
      <AppsExplorer
        apps={apps}
        categories={categories}
        favorites={favorites}
        initialQuery={searchParams.q ?? ""}
      />
    </div>
  );
}
