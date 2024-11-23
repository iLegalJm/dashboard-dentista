import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "El Dinero de Hoy",
    value: "S/. 53k",
    footer: {
      color: "text-green-500",
      value: "+55%",
      label: "que la semana pasada",
    },
  },
  {
    color: "gray",
    icon: UsersIcon,
    title: "Usuarios de Hoy",
    value: "300",
    footer: {
      color: "text-green-500",
      value: "+3%",
      label: "en el último mes",
    },
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "Nuevos clientes",
    value: "3,462",
    footer: {
      color: "text-red-500",
      value: "-2%",
      label: "que ayer",
    },
  },
  {
    color: "gray",
    icon: ChartBarIcon,
    title: "Ventas",
    value: "S/. 103,430",
    footer: {
      color: "text-green-500",
      value: "+5%",
      label: "que ayer",
    },
  },
];

export default statisticsCardsData;
