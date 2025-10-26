import Cookies from "js-cookie";
import { create } from "zustand";

// some possible problems need to handle 
// 1) need to figure a way to handle userInfo after loging in cause at this case the key set ok but the value at console is null cause its an async
// 2) don't know untill now what the best to handle role here or in role store
// 3) need to use loading and err states here all over the app to control it globally
// 4) isSigned didn't know should i use persist middleware or not 

export const useAuthStore = create((set) => ({
    // if user authenticated we get vslue from cookie else null
    userInfo: Cookies.get("userInfo")
        ? JSON.parse(Cookies.get("userInfo"))
        : null,
    setUserInfo: (newUserInfo) => set({ userInfo: newUserInfo }),
    // set from client side when making a request
    role: "",
    setRole: (newRole) => set({ role: newRole }),
    // if user authenticated we get value from cookie else null
    userToken: Cookies.get("token") || null,
    setUserToken: (newUserToken) => set({ userToken: newUserToken }),
    // control the loading state globally over all the application
    loading: false,
    setLoading: (newLoading) => set({ loading: newLoading }),
    // the flag to check if the user is authenticated or not
    isSigned: !!Cookies.get("token"),
    setIsSigned: (newIsSigned) => set({ isSigned: newIsSigned }),

    // the function which handles the authentication process
    handleAuth: (data) => {
        // construct token from the response
        const { token } = data;
        // Determine which user type is returned
        const user =
            data.student || data.instructor || data.admin || null;
        set({
            isSigned: true,
            loading: false,
            userInfo: data.student,
            userToken: data.token,
        });
        Cookies.set("token", token, { expires: 2 });
        Cookies.set("userInfo", JSON.stringify(user), { expires: 2 });
    },
    // the function which handles the logout
    handleLogout: () => {
        set({
            isSigned: false,
            loading: false,
            userInfo: null,
            userToken: null,
        });
        Cookies.remove("token");
        Cookies.remove("userInfo");
    },
    // control the error state globally over all the application
    err: "",
    setErr: (newErr) => set({ err: newErr }),
}));

