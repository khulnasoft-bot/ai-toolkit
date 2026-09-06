import { cn } from "@/lib/utils";

interface TextGridSectionProps {
  className?: string;
  data: {
    id: string;
    title: string;
    description: string;
  }[];
  description?: string;
  title?: string;
}

export const TextGridSection = ({
  className,
  data,
  description,
  title,
}: TextGridSectionProps) => (
  <section
    className={cn(
      "grid @min-[640px]:gap-16 gap-12 @min-[640px]:py-12 py-8",
      className
    )}
  >
    {title || description ? (
      <div className="grid max-w-3xl gap-2 text-balance">
        {title ? (
          <h2 className="font-[450]! @min-[1024px]:text-[40px] @min-[640px]:text-2xl @min-[768px]:text-3xl text-gray-1000 text-xl tracking-tighter">
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="text-gray-900 text-lg">{description}</p>
        ) : null}
      </div>
    ) : null}
    <div className="grid @min-[768px]:grid-cols-4 gap-8">
      {data.map((item) => (
        <div key={item.id}>
          <h3 className="mb-2 font-[450] text-gray-1000 text-heading-20 tracking-tight">
            {item.title}
          </h3>
          <p className="text-copy-16 text-gray-900">{item.description}</p>
        </div>
      ))}
    </div>
  </section>
);
