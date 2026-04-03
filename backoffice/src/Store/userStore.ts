import { devtools } from "zustand/middleware";
import type { User } from "../Types/UserTypes";
import { create } from "zustand";

interface UserStore {
	Userstate: User | null;
	code: string | null;
	setCode: (code: string) => void;
	setUserConnected: (state: User) => void;
	updateUserConnected: (newUserState: User) => void;
	clearUserConnected: () => void;
	clearCode: () => void;
}

export const userStore = create<UserStore>()(
	devtools((set) => ({
		Userstate: null,
		code: null,
		setUserConnected: (state) =>
			set(() => ({
				Userstate: state,
			})),
		setCode: (code) =>
			set(() => ({
				code: code,
			})),
		clearUserConnected: () =>
			set(() => ({
				Userstate: null,
			})),
		updateUserConnected: (newUserState) =>
			set((state) => ({
				Userstate: {
					...state.Userstate,
					...newUserState,
				},
			})),
		clearCode: () =>
			set(() => ({
				code: null,
			})),
	})),
);
