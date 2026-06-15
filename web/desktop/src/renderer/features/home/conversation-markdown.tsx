import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ConversationMarkdownProps = {
  content: string;
};

export function ConversationMarkdown({ content }: ConversationMarkdownProps): JSX.Element {
  return (
    <div className="markdown-body text-[15px] leading-8 text-foreground/92">
      <ReactMarkdown
        components={{
          a: ({ children, ...props }) => (
            <a className="text-accent underline underline-offset-4 transition hover:opacity-80" {...props}>
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l border-border/60 pl-4 text-muted">{children}</blockquote>
          ),
          code: ({ children, className, ...props }) => {
            const isInline = !className;

            if (isInline) {
              return (
                <code
                  className="rounded-md bg-surface/46 px-1.5 py-0.5 font-mono text-[0.92em] text-foreground"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                className="block overflow-x-auto rounded-2xl bg-surface/42 px-4 py-3 font-mono text-[13px] leading-6 text-foreground"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => <h1 className="font-display text-3xl font-black tracking-tight">{children}</h1>,
          h2: ({ children }) => <h2 className="font-display text-2xl font-black tracking-tight">{children}</h2>,
          h3: ({ children }) => <h3 className="font-display text-xl font-black tracking-tight">{children}</h3>,
          hr: () => <hr className="border-border/40" />,
          li: ({ children }) => <li className="ml-5 list-disc pl-1 marker:text-muted">{children}</li>,
          ol: ({ children }) => <ol className="space-y-2">{children}</ol>,
          p: ({ children }) => <p>{children}</p>,
          pre: ({ children }) => <pre className="my-0">{children}</pre>,
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-2xl border border-border/40">
              <table className="min-w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          td: ({ children }) => <td className="border-t border-border/30 px-3 py-2 align-top">{children}</td>,
          th: ({ children }) => (
            <th className="bg-surface/24 px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              {children}
            </th>
          ),
          ul: ({ children }) => <ul className="space-y-2">{children}</ul>
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
