"use client";

interface RichContentProps {
  content: string;
  className?: string;
}

export function RichContent({ content, className = "" }: RichContentProps) {
  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
