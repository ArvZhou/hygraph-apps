const USER = 'arvin.zhou';
const PASSWORD = 'arvin.zhou@hatchbetter.com';
const LOGIN_URL = 'https://epiccmsv2-website-cisandbox.ol.epicgames.net/login/authenticate';

export async function POST(req: Request, res: Response) {
    const formData = new FormData();

    formData.append('j_username', USER);
    formData.append('j_password', PASSWORD);
    formData.append('_spring_security_remember_me', 'off');

    const response = await fetch(LOGIN_URL, {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
        method: 'post',
        body: formData
    });

    return new Response('Login successful!', {
        status: 200,
        headers: {
            'Set-Cookie': response.headers.get('set-cookie')?.valueOf() as string
        }
    })
}