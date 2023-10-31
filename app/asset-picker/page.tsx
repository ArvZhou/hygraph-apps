'use client'
import React from 'react';
import { useApp, Wrapper } from '@hygraph/app-sdk-react';

function Install() {
  const { accessToken, login } = useLogin();
  const { updateInstallation, installation } = useApp();
  if (accessToken) {
    return <div>Connected as name@example.com</div>;
  }
  if (installation.status === 'COMPLETED') {
    return <div>This is asset management page!</div>;
  }
  return (
    <button
      onClick={async () => {
        login();
        await updateInstallation({
          status: 'COMPLETED',
          config: { KEY: 'value' },
        });
      }}
    >
      Connect to app
    </button>
  );
}

function useLogin() {
  const [accessToken, setAccessToken] = React.useState<string>('');
  function login() {
    setAccessToken('123456');
    localStorage.setItem('appToken', accessToken);
  }
  return { accessToken, login };
}

export default function Page() {
  return (
    <Wrapper>
      <Install />
    </Wrapper>
  );
}