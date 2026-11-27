import { useRef, useState } from "react";
import { LuCopy, LuCheck, LuCode } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  gsap,
  MOTION_MEDIA,
  MOTION_TOKENS,
  useIsomorphicLayoutEffect,
} from "../../../animations";

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-5 rounded-xl overflow-hidden bg-stone-50 border border-stone-200/90">
      <div className="flex items-center justify-between px-4 py-2 bg-stone-100/90 border-b border-stone-200/80">
        <div className="flex items-center space-x-2">
          <LuCode size={16} className="text-slate-500" />
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            {language || "Code"}
          </span>
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="text-slate-500 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded p-1 relative group cursor-pointer transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <LuCheck size={16} className="text-emerald-600" />
          ) : (
            <LuCopy size={16} />
          )}
          {copied && (
            <span className="absolute -top-8 right-0 bg-slate-900 text-white text-xs rounded-md px-2 py-1 shadow-sm">
              Copied!
            </span>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          fontSize: 12.5,
          margin: 0,
          padding: "1rem",
          background: "transparent",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

const AiResponsePreview = ({ content }) => {
  const previewRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!content || !previewRef.current) return undefined;

    const mm = gsap.matchMedia(previewRef.current);

    mm.add(
      {
        motionAllowed: MOTION_MEDIA.motionAllowed,
        reduced: MOTION_MEDIA.reduced,
      },
      (context) => {
        if (context.conditions.reduced) {
          gsap.set(previewRef.current, { opacity: 1, y: 0 });
          return undefined;
        }

        gsap.fromTo(
          previewRef.current,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.34,
            ease: MOTION_TOKENS.ease.smooth,
            clearProps: "transform",
          },
        );
        return undefined;
      },
    );

    return () => mm.revert();
  }, [content]);

  if (!content) return null;

  return (
    <div ref={previewRef} className="max-w-4xl">
      <div className="text-[14px] prose prose-slate dark:prose-invert max-w-none leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || " ");
              const language = match ? match[1] : "";

              const isInline = !className;

              return !isInline ? (
                <CodeBlock
                  code={String(children).replace(/\n$/, "")}
                  language={language}
                />
              ) : (
                <code
                  className="px-1.5 py-0.5 bg-stone-200/70 text-slate-800 rounded text-[13px] font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            p({ children }) {
              return <p className="mb-3.5 leading-6">{children}</p>;
            },
            strong({ children }) {
              return <strong className="font-semibold text-slate-900">{children}</strong>;
            },
            em({ children }) {
              return <em>{children}</em>;
            },
            ul({ children }) {
              return (
                <ul className="list-disc pl-6 space-y-2 my-3.5">{children}</ul>
              );
            },
            li({ children }) {
              return <li className="mb-1 leading-6">{children}</li>;
            },
            ol({ children }) {
              return (
                <ol className="list-decimal pl-6 space-y-2 my-3.5">
                  {children}
                </ol>
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-amber-300 bg-amber-50/40 pl-4 py-1 italic my-4 rounded-r">
                  {children}
                </blockquote>
              );
            },
            h1({ children }) {
              return (
                <h1 className="text-2xl font-bold mt-6 mb-4 text-slate-900">
                  {children}
                </h1>
              );
            },
            h2({ children }) {
              return (
                <h2 className="text-xl font-bold mt-6 mb-3 text-slate-900">
                  {children}
                </h2>
              );
            },
            h3({ children }) {
              return (
                <h3 className="text-lg font-bold mt-5 mb-2 text-slate-900">
                  {children}
                </h3>
              );
            },
            h4({ children }) {
              return (
                <h4 className="text-base font-bold mt-4 mb-2 text-slate-900">
                  {children}
                </h4>
              );
            },
            a({ children, href }) {
              return (
                <a
                  href={href}
                  className="text-amber-700 hover:text-amber-800 underline"
                >
                  {children}
                </a>
              );
            },
            table({ children }) {
              return (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full divide-y divide-stone-300 border border-stone-200 rounded-lg overflow-hidden">
                    {children}
                  </table>
                </div>
              );
            },
            thead({ children }) {
              return <thead className="bg-stone-100">{children}</thead>;
            },
            tbody({ children }) {
              return (
                <tbody className="divide-y divide-stone-200">{children}</tbody>
              );
            },
            tr({ children }) {
              return <tr>{children}</tr>;
            },
            th({ children }) {
              return (
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="px-3 py-2 whitespace-nowrap text-sm">
                  {children}
                </td>
              );
            },
            hr() {
              return <hr className="my-6 border-stone-200" />;
            },
            img({ src, alt }) {
              return (
                <img src={src} alt={alt} className="my-4 max-w-full rounded" />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default AiResponsePreview;
