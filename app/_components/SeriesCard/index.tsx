import Link from "next/link";
import type { FC } from "react";
import type { Series } from "@/types/series";

type SeriesCardProps = {
  series: Series;
  isLastSeries: boolean;
};

const SeriesCard: FC<SeriesCardProps> = ({ series, isLastSeries }) => {
  const lastSeriesClass = isLastSeries ? "" : "border-border border-b";
  const articleCountLabel = series.articleCount === 1 ? "1 article" : `${series.articleCount} articles`;

  return (
    <Link
      href={`/series/${series.slug}`}
      prefetch={true}
      className="group"
      aria-label={`Read article series: ${series.title}`}
    >
      <div
        className={`${lastSeriesClass} cursor-pointer rounded py-4 transition-colors group-hover:bg-muted group-focus-visible:bg-muted`}
      >
        <div className="mb-1 text-xl">{series.title}</div>
        <div className="text-muted-foreground text-sm">{articleCountLabel}</div>
        {series.description ? <p className="mt-2 text-muted-foreground text-sm">{series.description}</p> : null}
      </div>
    </Link>
  );
};

export default SeriesCard;
