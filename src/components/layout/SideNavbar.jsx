import {LayoutDashboard as LayoutDashboardIcon} from "lucide-react";
import {UsersRound as UsersRoundIcon} from "lucide-react";
import {CalendarDays as CalendarDaysIcon} from "lucide-react";
import {Wallet as WalletIcon} from "lucide-react";
import {IdCardLanyard as IdCardLanyardIcon} from "lucide-react";
import {ChartColumnBig as ChartColumnBigIcon} from "lucide-react";
import {Settings as SettingsIcon} from "lucide-react";
import {NavLink} from "react-router";

export function SideNavbar() {

  const NAVBAR_ITEMS = [
    {
      name: "Дэшборд",
      Icon: LayoutDashboardIcon,
      path: "/dashboard"
    },
    {
      name: "Клиенты",
      Icon: UsersRoundIcon,
      path: "/clients"
    },
    {
      name: "Записи",
      Icon: CalendarDaysIcon,
      path: "/appointments"
    },
    {
      name: "Финансы",
      Icon: WalletIcon,
      path: "/finances"
    },
    {
      name: "Сотрудники",
      Icon: IdCardLanyardIcon,
      path: "/employees"
    },
    {
      name: "Статистика",
      Icon: ChartColumnBigIcon,
      path: "/statistics"
    },
    {
      name: "Настройки",
      Icon: SettingsIcon,
      path: "/settings"
    },
  ]


  return (
    <nav className="side-navbar" aria-label="Основная навигация">
      {NAVBAR_ITEMS.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className="side-navbar__item"
        >
          <item.Icon aria-hidden="true" />
          {item.name}
        </NavLink>
      ))}
    </nav>
  )
}
