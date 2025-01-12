"use client";

import { CalendarDateRangePicker } from "@/components/fragments/date-range-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useArticles } from "@/hooks/services/use-articles";
import { useCategory } from "@/hooks/services/use-category";
import { useComment } from "@/hooks/services/use-comment";
import { Inbox, ListCollapse, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Overview, PeriodType } from "./_components/overview";
import { Title } from "./_components/title";
import { TopArticle } from "./_components/top-article";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<PeriodType | null>({
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(new Date().getFullYear(), 11, 31),
  });
  const { data: allArticles } = useArticles({
    allArticlesEnabled: true,
    params: { populate: "*" },
  }).getAllArticles;

  const { data: category } = useCategory({
    categoriesEnabled: true,
  }).categories;

  const { data: comment } = useComment({ enabledComments: true }).comments;

  const totalCategories = category?.meta?.pagination.total ?? 0;
  const totalArticles = allArticles?.meta?.pagination?.total ?? 0;
  const totalComments = comment?.meta?.pagination?.total ?? 0;

  const topFiveMostComment = allArticles?.data
    ?.map((article: any) => ({
      ...article,
      commentCount: article?.comments?.length,
    }))
    ?.sort((a: any, b: any) => b.commentCount - a.commentCount)
    ?.slice(0, 5);

  const dashCardFeatures = [
    {
      title: "Total Articles",
      name: "articles",
      description: `Articles published`,
      total: totalArticles,
      icon: <Inbox size={20} className="text-slate-300/70" />,
      shadowIcon: (
        <Inbox
          size={120}
          className="text-slate-300/5 absolute -right-3 -bottom-6"
        />
      ),
    },
    {
      title: "Total Categories",
      name: "categories",
      description: `Categories created`,
      total: totalCategories,
      icon: <ListCollapse size={20} className="text-slate-300/70" />,
      shadowIcon: (
        <ListCollapse
          size={120}
          className="text-slate-300/5 absolute -right-3 -bottom-6"
        />
      ),
    },
    {
      title: "Total Comments",
      name: "comments",
      description: "Comments created",
      total: totalComments,
      icon: <MessageCircle size={20} className="text-slate-300/70" />,
      shadowIcon: (
        <MessageCircle
          size={120}
          className="text-slate-300/5 absolute -right-3 -bottom-6"
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-5">
          <Title text="Dashboard" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dashCardFeatures.map((dashCard) => (
            <Card
              key={dashCard.title}
              className="border border-sky-500 bg-sky-900 shadow-md shadow-sky-300 overflow-hidden relative"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-base font-medium text-sky-300">
                  {dashCard.title}
                </CardTitle>
                {dashCard.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-sky-100">
                  +{dashCard.total}
                </div>
                <p className="text-xs text-sky-100">{dashCard.description}</p>
                {dashCard.shadowIcon}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border border-sky-900">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Overview</CardTitle>

            <CalendarDateRangePicker
              onSelectPicker={(value) => {
                setSelectedDate({
                  startDate: value?.from!,
                  endDate: value?.to!,
                });
              }}
            />
          </CardHeader>
          <CardContent className="pl-2">
            <Overview articles={allArticles?.data} period={selectedDate!} />
          </CardContent>
        </Card>
        <Card className="col-span-3 border border-sky-900">
          <CardHeader>
            <CardTitle>Top 5 Articles</CardTitle>
            <CardDescription>base on most comments.</CardDescription>
          </CardHeader>
          <CardContent>
            <TopArticle items={topFiveMostComment} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
