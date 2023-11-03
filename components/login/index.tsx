import { useEffect, useState } from 'react';

const USER = 'arvin.zhou';
const PASSWORD = 'arvin.zhou@hatchbetter.com';
// const LOGIN_URL = 'https://epiccmsv2-website-cisandbox.ol.epicgames.net/login/authenticate';
const LOGIN_URL = '/epic-asset-picker/api/login';

export const useLogin = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);

    const login = async () => {

        console.log('Go to login');
        await fetch(LOGIN_URL, { method: 'post', body: '{ name: "arvin" }' });

        setIsLogin(true);
    }

    useEffect(() => { login() }, [])

    return { isLogin };
}