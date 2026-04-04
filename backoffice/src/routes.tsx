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
import GestionCommentaire from "./Pages/GestionCommentaire";
import AjoutCommentaire from "./Pages/AjoutCommentaire";
import EditionCommentaire from "./Pages/EditionCommentaire";

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
			{
				path: "/gestion-commentaire",
				middleware: [authMiddleware],
				element: <GestionCommentaire />,
			},
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
			{
				path: "commentaire",
				middleware: [authMiddleware],
				children: [
					{ path: "ajout", Component: AjoutCommentaire },
					{
						path: "edition",
						children: [{ path: ":id", Component: EditionCommentaire }],
					},
				],
			},
		],
	},
];
