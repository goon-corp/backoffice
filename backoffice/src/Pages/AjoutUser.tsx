// import { useNavigate } from "react-router";
// import { useCreateUser } from "../hooks/useUser";
// import { useState } from "react";
// import type { CreateUserDto } from "../Types/UserTypes";

// export default function AjoutUser() {
// 	const navigate = useNavigate();
// 	const { mutate: createUser, isPending } = useCreateUser();

// 	const [formData, setFormData] = useState<CreateUserDto>({
// 		name: "",
// 		firstname: "",
// 		mail: "",
// 		password: "",
// 		token: "",
// 		idRole: "",
// 	});

// 	const [errors, setErrors] = useState<Record<string, string>>({});
// 	const [success, setSuccess] = useState(false);

// 	const handleChange = (
// 		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
// 	) => {
// 		const { name, value, type } = e.target;
// 		setFormData((prev) => ({
// 			...prev,
// 			[name]:
// 				type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
// 		}));
// 	};

// 	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
// 		e.preventDefault();
// 		setSuccess(false);
// 		setErrors({});

// 		if (!validate()) return;

// 		createUser(
// 			{
// 				...formData,
// 				idRole: roleToRoleId(formData.idRole),
// 			},
// 			{
// 				onSuccess: () => {
// 					setSuccess(true);
// 					navigate("/gestion-user");
// 				},
// 				onError: () => {
// 					setErrors({
// 						general: "Erreur lors de la création de l'utilisateur.",
// 					});
// 				},
// 			},
// 		);
// 	};

// 	const validate = (): boolean => {
// 		const newErrors: Record<string, string> = {};
// 		if (!formData.name.trim()) newErrors.name = "Le nom est requis.";
// 		if (!formData.firstname.trim())
// 			newErrors.firstname = "Le prénom est requis.";
// 		if (!formData.mail.trim() || !formData.mail.includes("@"))
// 			newErrors.mail = "Un email valide est requis.";
// 		if (!formData.password || formData.password.length < 6)
// 			newErrors.password = "Le mot de passe doit faire au moins 6 caractères.";
// 		if (!formData.idRole) newErrors.idRole = "Le rôle est requis.";
// 		setErrors(newErrors);
// 		return Object.keys(newErrors).length === 0;
// 	};

// 	return (
// 		<div className="max-w-lg mx-auto mt-8 p-6 border border-gray-300 rounded">
// 			<div className="mb-4 font-bold border-b border-gray-400">
// 				<h3 className="font-extrabold font-playfair">Ajouter un utilisateur</h3>
// 			</div>

// 			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
// 				{/* Nom */}
// 				<div className="flex flex-col">
// 					<label htmlFor="name">Nom</label>
// 					<input
// 						type="text"
// 						name="name"
// 						id="name"
// 						value={formData.name}
// 						onChange={handleChange}
// 						className="border border-gray-300 rounded px-2 py-1"
// 					/>
// 					{errors.name && (
// 						<span className="text-red-600 text-sm">{errors.name}</span>
// 					)}
// 				</div>

// 				{/* Prénom */}
// 				<div className="flex flex-col">
// 					<label htmlFor="firstname">Prénom</label>
// 					<input
// 						type="text"
// 						name="firstname"
// 						id="firstname"
// 						value={formData.firstname}
// 						onChange={handleChange}
// 						className="border border-gray-300 rounded px-2 py-1"
// 					/>
// 					{errors.firstname && (
// 						<span className="text-red-600 text-sm">{errors.firstname}</span>
// 					)}
// 				</div>

// 				{/* Email */}
// 				<div className="flex flex-col">
// 					<label htmlFor="mail">Email</label>
// 					<input
// 						type="email"
// 						name="mail"
// 						id="mail"
// 						value={formData.mail}
// 						onChange={handleChange}
// 						className="border border-gray-300 rounded px-2 py-1"
// 					/>
// 					{errors.mail && (
// 						<span className="text-red-600 text-sm">{errors.mail}</span>
// 					)}
// 				</div>

// 				{/* Mot de passe */}
// 				<div className="flex flex-col">
// 					<label htmlFor="password">Mot de passe</label>
// 					<input
// 						type="password"
// 						name="password"
// 						id="password"
// 						value={formData.password}
// 						onChange={handleChange}
// 						className="border border-gray-300 rounded px-2 py-1"
// 					/>
// 					{errors.password && (
// 						<span className="text-red-600 text-sm">{errors.password}</span>
// 					)}
// 				</div>

// 				{/* Rôle */}
// 				<div className="flex flex-col">
// 					<label htmlFor="idRole">Rôle</label>
// 					<select
// 						name="idRole"
// 						id="idRole"
// 						value={formData.idRole}
// 						onChange={handleChange}
// 						className="border border-gray-300 rounded px-2 py-1"
// 					>
// 						<option value="">Sélectionnez un rôle</option>{" "}
// 						<option value="admin">Admin</option>
// 						<option value="appuser">Appuser</option>
// 					</select>
// 					{errors.idRole && (
// 						<span className="text-red-600 text-sm">{errors.idRole}</span>
// 					)}
// 				</div>

// 				{/* Erreur générale */}
// 				{errors.general && (
// 					<span className="text-red-600 text-sm">{errors.general}</span>
// 				)}

// 				{/* Succès */}
// 				{success && (
// 					<span className="text-green-600 text-sm">
// 						Utilisateur créé avec succès !
// 					</span>
// 				)}

// 				<div className="flex flex-row justify-center gap-4 mt-4">
// 					<Bouton
// 						text={"Retour"}
// 						colorClass={"bg-gray-300"}
// 						hoverColorClass="text-white bg-[#282D99]"
// 						onClick={() => navigate("/gestion-user")}
// 					/>
// 					<Bouton
// 						text={isPending ? "Création..." : "Créer"}
// 						colorClass={"bg-[#282D99] text-white"}
// 						hoverColorClass={"hover:bg-white hover:text-[#282D99]"}
// 						customType={"submit"}
// 					/>
// 				</div>
// 			</form>
// 		</div>
// 	);
// }
