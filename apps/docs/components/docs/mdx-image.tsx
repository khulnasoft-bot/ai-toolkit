export const MDXImage = ({
  caption,
  alt,
  src,
  srcLight = src,
  srcDark = srcLight,
  width,
  height,
  widthDark = width,
  heightDark = height,
}: {
  alt?: string;
  caption?: string;
  src?: string;
  srcLight?: string;
  srcDark?: string;
  width?: number | string;
  height?: number | string;
  widthDark?: number | string;
  heightDark?: number | string;
}) => {
  return (
    <figure>
      {/* biome-ignore lint/performance/noImgElement: theme-specific public asset */}
      <img
        alt={alt ?? caption ?? ''}
        className="block rounded-lg border border-gray-alpha-400 bg-gray-100 dark:hidden"
        height={height}
        loading="lazy"
        src={srcLight}
        width={width}
      />
      {/* biome-ignore lint/performance/noImgElement: theme-specific public asset */}
      <img
        alt={alt ?? caption ?? ''}
        className="hidden rounded-lg border border-gray-alpha-400 bg-gray-100 dark:block"
        height={heightDark}
        loading="lazy"
        src={srcDark}
        width={widthDark}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
};
