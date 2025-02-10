import React from "react";
import GithubSlugger from "github-slugger";

const stripMarkdown = (text) => {
  return text.replace(/(\*\*|__|\*|_|`)/g, "");
};

const extractHeadings = (content) => {
  // 1) Üçlü backtick'ler arasındaki tüm metni siler
  //    [\s\S] ifadesi newline da dahil olmak üzere tüm karakterleri kapsar.
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");

  // 2) Kalan içerikte başlıkları arar
  const headingRegex = /^(#{1,6})\s+(.*)$/gm;
  const headings = [];
  const slugger = new GithubSlugger();
  let match;

  while ((match = headingRegex.exec(withoutCodeBlocks)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const text = stripMarkdown(rawText);
    const slug = slugger.slug(text);
    headings.push({ level, text, slug });
  }
  return headings;
};

const TableOfContents = ({ content }) => {
  const headings = extractHeadings(content);

  if (!headings.length) {
    return null;
  }

  return (
    <nav className="toc  p-6   sticky text-sm">
      <h2 className="text-xl text-center font-bold mb-2">Başlıklar</h2>
      <ul className="list-disc">
        {headings.map((heading, index) => (
          <li
            key={index}
            className="mb-2"
            style={{ marginLeft: (heading.level - 1) * 10 }}
          >
            <a
              href={`#${heading.slug}`}
              className="text-gray-700 hover:underline cursor-pointer"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
