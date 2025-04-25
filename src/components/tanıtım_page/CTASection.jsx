export default function CTASection() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-20 sm:px-6 sm:py-20 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
          >
            <circle
              r={512}
              cx={512}
              cy={512}
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#395480" />
                <stop offset={1} stopColor="#465F88" />
              </radialGradient>
            </defs>
          </svg>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left lg:w-1/3">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Modelini Eğit, Geleceği Tahmin Et
            </h2>
            <p className="mt-6 text-pretty text-lg/8 text-gray-300">
              Yatırım Kararlarında Yeni Dönem: Derin Öğrenme Destekli Analiz.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <a
                href="#"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Get started
              </a>
              <a href="#" className="text-sm/6 font-semibold text-white">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="relative flex items-center justify-center mt-16 lg:mt-8 lg:w-2/3">
            <div className="w-full overflow-hidden rounded-xl">
              <img
                alt="App screenshot"
                src="../public/Apr 25, 2025, 01_49_25 PM.png"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
