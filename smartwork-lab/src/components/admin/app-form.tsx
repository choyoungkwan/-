"use client";
import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, Select } from "@/components/ui/input";
import { createWebAppAction } from "@/lib/actions";
import { isValidUrl, slugify } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function AppForm({
  categories,
  existingUrls,
}: {
  categories: Category[];
  existingUrls: string[];
}) {
  const [name, setName] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function validate(e: React.FormEvent<HTMLFormElement>) {
    // 오류 방지 기준: 필수 입력 / URL 검증 / 중복 등록 방지
    if (!name.trim()) {
      setError("웹앱명을 입력하세요.");
      e.preventDefault();
      return;
    }
    if (!isValidUrl(url)) {
      setError("올바른 URL(http/https)을 입력하세요.");
      e.preventDefault();
      return;
    }
    if (existingUrls.includes(url.trim())) {
      setError("이미 동일한 URL의 웹앱이 등록되어 있습니다.");
      e.preventDefault();
      return;
    }
    setError(null);
  }

  return (
    <form action={createWebAppAction} onSubmit={validate} className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="name">웹앱명 *</Label>
        <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="예: 후원자 관리 대장" />
      </div>
      <input type="hidden" name="slug" value={slugify(name)} />

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="description">설명</Label>
        <Textarea id="description" name="description" placeholder="웹앱 기능을 간단히 설명하세요" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="categoryId">카테고리 *</Label>
        <Select id="categoryId" name="categoryId" required defaultValue={categories[0]?.id}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status">상태</Label>
        <Select id="status" name="status" defaultValue="operating">
          <option value="operating">운영중</option>
          <option value="maintenance">점검중</option>
          <option value="deprecated">종료</option>
        </Select>
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="url">URL *</Label>
        <Input id="url" name="url" value={url} onChange={(e) => setUrl(e.target.value)} required placeholder="https://apps.uman.or.kr/..." />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="owner">담당자 *</Label>
        <Input id="owner" name="owner" required placeholder="담당자 이름" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ownerEmail">담당자 이메일</Label>
        <Input id="ownerEmail" name="ownerEmail" type="email" placeholder="name@uman.or.kr" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="version">버전</Label>
        <Input id="version" name="version" defaultValue="1.0.0" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="icon">아이콘 (lucide 이름)</Label>
        <Input id="icon" name="icon" defaultValue="AppWindow" placeholder="예: HeartHandshake" />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
        <Input id="tags" name="tags" placeholder="후원, 영수증, CRM" />
      </div>

      {error && (
        <p className="sm:col-span-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" className="w-full"><Plus /> 웹앱 등록</Button>
      </div>
    </form>
  );
}
