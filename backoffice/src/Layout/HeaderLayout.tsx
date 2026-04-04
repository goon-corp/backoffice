import { NavLink, Outlet, useNavigate, useLocation } from "react-router";
import { userStore } from "../Store/userStore";

const navLinks = [
	{ to: "/", label: "Dashboard", icon: "⊞" },
	{ to: "/gestion-user", label: "Utilisateurs", icon: "👤" },
	{ to: "/gestion-ressource", label: "Ressources", icon: "📄" },
	{ to: "/gestion-ressource-categorie", label: "Catégories", icon: "🏷️" },
	{ to: "/gestion-emotion", label: "Émotions", icon: "💬" },
];

const HeaderLayout = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const user = userStore((s) => s.Userstate);
	const clearUserConnected = userStore((s) => s.clearUserConnected);

	const isLoginPage = location.pathname === "/login";

	const handleLogout = () => {
		document.cookie =
			"sessionToken=; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Strict";
		clearUserConnected();
		navigate("/login");
	};

	if (isLoginPage) {
		return <Outlet />;
	}

	return (
		<div className="flex min-h-screen bg-gray-100">
			<aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
				<div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
					<div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
						<span className="text-white text-sm font-bold">B</span>
					</div>
					<span className="font-semibold text-gray-800">Backoffice</span>
				</div>

				<nav className="flex-1 px-3 py-4 flex flex-col gap-1">
					{navLinks.map((link) => (
						<NavLink
							key={link.to}
							to={link.to}
							end={link.to === "/"}
							className={({ isActive }) =>
								`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
									isActive
										? "bg-blue-50 text-blue-700 font-medium"
										: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
								}`
							}
						>
							<span className="text-base">{link.icon}</span>
							{link.label}
						</NavLink>
					))}
				</nav>

				{user && (
					<div className="px-3 py-4 border-t border-gray-200">
						<div className="flex items-center gap-3 px-3 py-2 mb-1">
							<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
								<span className="text-blue-700 text-xs font-semibold uppercase">
									{user.first_name?.[0] ?? "A"}
								</span>
							</div>
							<div className="min-w-0">
								<p className="text-sm font-medium text-gray-800 truncate">
									{user.first_name} {user.last_name}
								</p>
								<p className="text-xs text-gray-400 truncate">
									{user.user_name}
								</p>
							</div>
						</div>
						<button
							onClick={handleLogout}
							className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
						>
							<span>⎋</span>
							Déconnexion
						</button>
					</div>
				)}
			</aside>

			<div className="flex-1 flex flex-col min-w-0">
				<header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
					<h1 className="text-lg font-semibold text-gray-800">
						{navLinks.find((l) => l.to === location.pathname)?.label ??
							"Backoffice"}
					</h1>
					<span className="text-xs text-gray-400">
						{new Date().toLocaleDateString("fr-FR", { dateStyle: "long" })}
					</span>
				</header>

				<main className="flex-1 p-6 overflow-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default HeaderLayout;
