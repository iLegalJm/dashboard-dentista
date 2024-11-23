import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { element } from "prop-types";
import Logout from "./pages/auth/logout";
import { Doctor } from "./pages/dashboard/doctor";
import { Especialidad } from "./pages/dashboard/especialidad";
const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  // {
  //   layout: "main",
  //   pages: [
  //     {
  //       name: "Inicio",
  //       path: "/",
  //       element: <Init />,
  //     },
  //   ]
  // },
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      // {
      //   icon: <HomeIcon {...icon} />,
      //   name: "principal",
      //   children: [
      //     {
      //       name: "home",
      //       path: "/principal/home",
      //       element: <Home />,
      //     },
      //     {
      //       name: "otra-ruta",
      //       path: "/principal/otra-ruta",
      //       element: <Home />,
      //     },
      //     // Agrega más rutas hijas aquí
      //   ],
      // },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Citas",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Especialidades",
        path: "/especialidades",
        element: <Especialidad />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Doctores",
        path: "/doctors",
        element: <Doctor />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Notificaciones",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Perfil",
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    title: "Autenficación",
    layout: "",
    pages: [
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Cerrar sesión",
        path: "logout",
        element: <Logout />,
      },
    ],
  },
];

export default routes;
