import api, { ResponseApi } from "@libs/apis/api";
import { CreateUserRequest, IUser, LoginUserRequest } from "@libs/types/user";

export const auth = {
    login: (credentials: LoginUserRequest) =>
        api.post<ResponseApi<IUser>>("/users/login", credentials, {
            withCredentials: true,
        }),
    oauthLogin: (data: { code: string; provider: string; redirect_uri: string }) =>
        api.post<ResponseApi<IUser>>("/users/login/oauth", data, {
            withCredentials: true,
        }),
    register: (data: CreateUserRequest) =>
        api.post<ResponseApi<IUser>>("/users/register", data, {
            withCredentials: true,
        }),
    verify: (data: { otp: string; email: string }) =>
        api.post<ResponseApi<IUser>>("/users/verify", data, {
            withCredentials: true,
        }),
    resend: (data: { email: string }) =>
        api.post<ResponseApi<IUser>>("/users/resend-otp", data, {
            withCredentials: true,
        }),
    getCurrentUser: () =>
        api.get<ResponseApi<IUser>>("/users/get-me", {
            withCredentials: true,
        }),
    logout: () =>
        api.post<ResponseApi<void>>(
            "/users/logout",
            {},
            {
                withCredentials: true,
            },
        ),
};
