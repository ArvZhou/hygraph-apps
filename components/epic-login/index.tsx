import { useEffect, useState, useCallback } from 'react';

const LOGIN_URL = 'http://localhost:3001/api/epic/login';

type UseLoginProps = (arg: {username: string, password: string, domain: string}) => { isLogin: boolean };

export const useLogin: UseLoginProps = ({username, password, domain}) => {
    const [isLogin, setIsLogin] = useState<boolean>(false);

    const login = useCallback(async () => {
        await fetch(LOGIN_URL, {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'post',
            body: JSON.stringify({ username, password, domain })
        });

        setIsLogin(true);
    }, [username, password, domain])

    useEffect(() => { login() }, [login])

    return { isLogin };
}