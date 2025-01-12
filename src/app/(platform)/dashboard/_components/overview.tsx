"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { INITIAL_RANGE_DATE } from "@/lib/date";
import { Line, LineChart, XAxis } from "recharts";

export type PeriodType = {
  startDate: Date;
  endDate: Date;
};

const groupChartDataByYear = (articles: any, period: PeriodType) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const startMonthIndex = period?.startDate?.getMonth();
  const endMonthIndex = period?.endDate?.getMonth();
  const startYear = period?.startDate?.getFullYear();
  const endYear = period?.endDate?.getFullYear();

  // Generate the range of months for the given period
  const monthlyData: any = [];
  let currentYear = startYear;
  let currentMonthIndex = startMonthIndex;

  while (
    currentYear < endYear ||
    (currentYear === endYear && currentMonthIndex <= endMonthIndex)
  ) {
    monthlyData.push({
      month: months[currentMonthIndex],
      totalComment: 0,
      totalArticle: 0,
      year: currentYear,
    });

    currentMonthIndex++;
    if (currentMonthIndex === 12) {
      currentMonthIndex = 0;
      currentYear++;
    }
  }

  // Iterate over each article
  articles.forEach((article: any) => {
    const articleDate = new Date(article.createdAt);
    if (articleDate >= period?.startDate && articleDate <= period?.endDate) {
      const articleMonthIndex = articleDate.getMonth();
      const articleYear = articleDate.getFullYear();

      // Find the matching month in monthlyData
      const monthData = monthlyData.find(
        (data: any) =>
          data.year === articleYear &&
          months.indexOf(data.month) === articleMonthIndex
      );
      if (monthData) {
        monthData.totalArticle += 1;
      }
    }

    // Process comments for the range
    article.comments.forEach((comment: any) => {
      const commentDate = new Date(comment.createdAt);
      if (commentDate >= period?.startDate && commentDate <= period?.endDate) {
        const commentMonthIndex = commentDate.getMonth();
        const commentYear = commentDate.getFullYear();

        // Find the matching month in monthlyData
        const monthData = monthlyData.find(
          (data: any) =>
            data.year === commentYear &&
            months.indexOf(data.month) === commentMonthIndex
        );
        if (monthData) {
          monthData.totalComment += 1;
        }
      }
    });
  });

  // Remove the year property before returning the data
  return monthlyData.map(({ year, ...data }: any) => data);
};

export function Overview({
  articles = [],
  period = INITIAL_RANGE_DATE,
}: Readonly<{ articles: any; period?: PeriodType }>) {
  // Example usage
  const chartData = groupChartDataByYear(articles, period);

  const chartConfig = {
    article: {
      label: "Articles",
      color: "hsl(var(--chart-1))",
    },
    comment: {
      label: "Comments",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey="totalArticle"
          type="natural"
          stroke="var(--color-article)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="totalComment"
          type="natural"
          stroke="var(--color-comment)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
