import React from "react";
import ReactMarkdown from "react-markdown";
import BlogSidebarComponent from "../BlogSidebarComponent";
const markdownContent = `
# Markdown Temelleri ve Kullanımı
Markdown, basit ve okunaklı bir biçimde yazı yazmayı sağlayan bir işaretleme dilidir.  
HTML gibi karmaşık kodlar yerine **daha basit bir sözdizimi** kullanarak yazılarınızı biçimlendirebilirsiniz.

## 📌 Başlıklar (Headings)
Markdown'da başlıklar \`#\` sembolü ile oluşturulur:
\`\`\`md
# Başlık 1 (H1)
## Başlık 2 (H2)
### Başlık 3 (H3)
\`\`\`

## 📌 Kalın, İtalik ve Üstü Çizili Metinler
\`\`\`md
**Bu metin kalın**  
*Bu metin italik*  
~~Bu metin üstü çizili~~  
***Bu metin hem kalın hem italik***
\`\`\`

## 📌 Link Ekleme
\`\`\`md
[Örnek Link](https://www.ornek.com)
\`\`\`

## 📌 Görsel Ekleme
\`\`\`md
![Resim Açıklaması](https://via.placeholder.com/150)
\`\`\`

## 📌 Listeleme
\`\`\`javascript
- Birinci madde
- İkinci madde
  - Alt madde
  - Alt madde
- Üçüncü madde
\`\`\`
- Birinci madde
- İkinci madde
  - Alt madde
  - Alt madde
- Üçüncü madde

## 📌 Kod Blokları
\`\`\`javascript
örn \`\`\`javascript
console.log("Merhaba, dünya!");
\`\`\` örn bitiş
\`\`\`

## 📌 Alıntı Yapma
> altı yapmak için ">" kullan

## 📌 Tablo Oluşturma
\`\`\`javascript
| Başlık 1 | Başlık 2 | Başlık 3 |
|----------|----------|----------|
| Veri 1   | Veri 2   | Veri 3   |
| Veri 4   | Veri 5   | Veri 6   |
\`\`\`


🚀 **Markdown kullanarak hızlı ve şık içerikler hazırlayabilirsiniz!**
`;

const CheatSheet = () => {
  return (
    <div className="flex min-h-screen w-full">
      <BlogSidebarComponent />
      <div className="flex-1 p-4 md:p-6 overflow-x-auto">
        <h1 className="text-2xl font-bold mb-4">📖 Markdown Cheat Sheet</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ReactMarkdown className="prose max-w-none">
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default CheatSheet;
