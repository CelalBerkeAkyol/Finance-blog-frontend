// NavbarNested.jsx
import {
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  DocumentChartBarIcon,
  ChartPieIcon,
  LockClosedIcon,
  DocumentTextIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/solid";

// Eski Tabler ikonlarını burada Heroicons ile değiştiriyoruz
const mockdata = [
  { label: "Dashboard", icon: ChartPieIcon },
  {
    label: "Market news",
    icon: DocumentTextIcon,
    initiallyOpened: true,
    links: [
      { label: "Overview", link: "/" },
      { label: "Forecasts", link: "/" },
      { label: "Outlook", link: "/" },
      { label: "Real time", link: "/" },
    ],
  },
  {
    label: "Releases",
    icon: CalendarDaysIcon,
    links: [
      { label: "Upcoming releases", link: "/" },
      { label: "Previous releases", link: "/" },
      { label: "Releases schedule", link: "/" },
    ],
  },
  { label: "Analytics", icon: PresentationChartBarIcon },
  { label: "Contracts", icon: DocumentChartBarIcon },
  { label: "Settings", icon: AdjustmentsHorizontalIcon },
  {
    label: "Security",
    icon: LockClosedIcon,
    links: [
      { label: "Enable 2FA", link: "/" },
      { label: "Change password", link: "/" },
      { label: "Recovery codes", link: "/" },
    ],
  },
];

export function NavbarNested() {
  // Burada önceden LinksGroup, UserButton ve Logo gibi bileşenleriniz olduğunuzu varsayıyoruz.
  // Eğer bu bileşenler yoksa, önceki yanıtta gösterildiği gibi placeholderlar oluşturun.
  const links = mockdata.map((item) => (
    <div key={item.label} className="mb-4">
      <div className="font-bold flex items-center space-x-2">
        {/* Iconu direkt React bileşeni gibi kullanıyoruz */}
        <item.icon className="w-5 h-5" />
        <span>{item.label}</span>
      </div>
      {item.links && (
        <ul className="ml-6 mt-2 list-disc">
          {item.links.map((l, i) => (
            <li key={i}>{l.label}</li>
          ))}
        </ul>
      )}
    </div>
  ));

  return (
    <nav className="bg-white dark:bg-gray-800 h-[800px] w-[300px] p-4 pb-0 flex flex-col border-r border-gray-300 dark:border-gray-700">
      {/* Header */}
      <div className="pb-4 mb-0 border-b border-gray-300 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xl">MyLogo</div>
          <code className="font-bold text-sm">v3.1.2</code>
        </div>
      </div>

      {/* Links (Scrollable area) */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-6">{links}</div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 dark:border-gray-700 mt-4 pt-4">
        <button className="w-full py-2 bg-blue-600 text-white font-semibold rounded">
          User
        </button>
      </div>
    </nav>
  );
}
