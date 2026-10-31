import { Card, CardContent } from "@knegarloggen/ui/card";

const Block = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className}`} />
);

export default function OversiktSkelett() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-2 pt-6">
          <Block className="h-3 w-40" />
          <Block className="h-7 w-48" />
          <Block className="h-4 w-32" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Block key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-4 pt-6">
              <Block className="h-5 w-36" />
              {Array.from({ length: 3 }).map((_, j) => (
                <Block key={j} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
