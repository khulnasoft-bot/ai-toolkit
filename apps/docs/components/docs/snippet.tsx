export const Snippet = ({
  text,
  prompt = true,
}: {
  text: string | string[];
  width?: number | string;
  prompt?: boolean;
  dark?: boolean;
}) => (
  <pre className="not-prose my-4 overflow-x-auto rounded-md border border-gray-alpha-400 bg-background-100 p-4 font-mono text-[13px] leading-6 text-gray-1000">
    {(Array.isArray(text) ? text : text.split('\n')).map((line, index) => (
      <div key={index}>
        {prompt ? <span className="select-none text-gray-700">$ </span> : null}
        {line}
      </div>
    ))}
  </pre>
);
