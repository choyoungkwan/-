import Link from "next/link";
import { Star } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { AppCard } from "@/components/webapp/app-card";
import { Button } from "@/components/ui/button";
import * as data from "@/lib/data";

export const metadata = { title: "즐겨찾기" };

export default function FavoritesPage() {
  const favorites = data.getFavorites();
  const apps = data.getWebApps().filter((a) => favorites.includes(a.id));
  const categories = data.getCategories();
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  return (
    <div>
      <PageHeader title="즐겨찾기" description="자주 사용하는 웹앱을 모아 빠르게 실행하세요." />
      {apps.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
          <Star className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">아직 즐겨찾기한 웹앱이 없습니다.</p>
          <Link href="/apps"><Button variant="outline">웹앱 둘러보기</Button></Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {apps.map((a) => (
            <AppCard key={a.id} app={a} category={catMap[a.categoryId]} isFavorite />
          ))}
        </div>
      )}
    </div>
  );
}
