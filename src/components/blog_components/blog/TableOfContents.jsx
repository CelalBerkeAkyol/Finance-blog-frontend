import React from "react";
import GithubSlugger from "github-slugger";

const stripMarkdown = (text) => {
  return text.replace(/(\*\*|__|\*|_|`)/g, "");
};

const extractHeadings = (content) => {
  // 1) Üçlü backtick'ler arasındaki tüm metni siler
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
    <div className="w-full pl-5">
      <h2 className="text-lg text-left text-gray-800 font-bold mb-2">
        Hızlı Erişim
      </h2>
      <ul className="list-none">
        {headings.map((heading, index) => (
          <li
            key={index}
            className="mb-1"
            style={{ marginLeft: (heading.level - 1) * 10 }}
          >
            <a
              href={`#${heading.slug}`}
              className="text-gray-700 hover:underline cursor-pointer text-xs"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
