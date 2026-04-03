import type { RouteObject } from "react-router";
import App from "./App";
import { authMiddleware } from "./Middleware/authMiddleware";
import Login from "./Pages/Login";
import HeaderLayout from "./Layout/HeaderLayout";
import GestionUser from "./Pages/GestionUser";
import EditionUser from "./Pages/EditionUser";
import AjoutUser from "./Pages/AjoutUser";
import EditionResource from "./Pages/EditionResource";
import AjoutResource from "./Pages/AjoutResource";
import GestionResource from "./Pages/GestionResource";

export const routes: RouteObject[] = [
	{
		element: <HeaderLayout />,
		children: [
			{
				path: "/",
				middleware: [authMiddleware],
				element: <App />,
			},
			{
				path: "/gestion-user",
				middleware: [authMiddleware],
				element: <GestionUser />,
			},
			{
				path: "/gestion-ressource",
				middleware: [authMiddleware],
				element: <GestionResource />,
			},
			// {
			// 	path: "/gestion-ressource-categorie",
			// 	middleware: [authMiddleware],
			// 	element: <GestionRessourceCat />,
			// },
			// {
			// 	path: "/gestion-emotion",
			// 	middleware: [authMiddleware],
			// 	element: <GestionEmotion />,
			// },
			{
				path: "/login",
				middleware: [authMiddleware],
				element: <Login />,
			},
			// {
			// 	path: "/register",
			// 	middleware: [authMiddleware],
			// 	element: <Register />,
			// },
			{
				path: "user",
				middleware: [authMiddleware],
				children: [
					{ path: "ajout-utilisateur", Component: AjoutUser },
					{
						path: "edition",
						children: [{ path: ":id", Component: EditionUser }],
					},
				],
			},
			{
				path: "ressource",
				middleware: [authMiddleware],
				children: [
					{ path: "ajout", Component: AjoutResource },
					{
						path: "edition",
						children: [{ path: ":id", Component: EditionResource }],
					},
				],
			},
			// {
			// 	path: "ressource-categorie",
			// 	middleware: [authMiddleware],
			// 	children: [
			// 		{ path: "ajout", Component: AjoutRessourceCat },
			// 		{
			// 			path: "edition",
			// 			children: [{ path: ":id", Component: EditionRessourceCat }],
			// 		},
			// 	],
			// },
		],
	},
];
