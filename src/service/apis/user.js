//登录方法
import {http} from "@/service/index.js";

export const login = (data) => http.get('/api/v1/passport/login', {params: data});


export const updateUserInfo = (data) => http.put('/api/v1/user/update', data, {});