import { Link } from "react-router-dom";
export default function HeroTail() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-4 sm:px-6 pt-10 sm:pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-4xl py-16 sm:py-24 md:py-32 lg:py-40">
          <div className="text-center">
            <h1 className="text-balance text-4xl font-semibold  text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
              Finans, Ekonomi ve Yapay Zekanın Kesişim Noktası
            </h1>
            <p className="mt-6 sm:mt-8 text-pretty text-base sm:text-lg font-medium text-gray-500 sm:text-xl leading-8">
              Kişisel finans yönetiminden, şirket değerlemesine, yapay zeka ile
              yatırım stratejilerine kadar her şey.
            </p>
            <div className="hidden sm:mt-8 sm:flex sm:justify-center gap-4">
              {/* Kategorileri Keşfet */}
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Kategorileri Keşfet.{" "}
                <a
                  href="/blog/categories"
                  className="font-semibold text-primary"
                >
                  <span aria-hidden="true" className="absolute inset-0" />
                  Kategorileri Görüntüle <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
              {/* Yazıları Keşfet */}
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Yazıları Keşfet.{" "}
                <a href="/blog/posts" className="font-semibold text-primary">
                  <span aria-hidden="true" className="absolute inset-0" />
                  Son Yazıları Görüntüle <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
  );
}
