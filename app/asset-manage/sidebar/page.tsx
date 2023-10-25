'use client'
import { Wrapper, useFormSidebarExtension, useApp } from '@hygraph/app-sdk-react';

function Setup() {
    const { installation } = useApp();

    if (installation.status === 'COMPLETED') {
        return <SerpPreview />;
    }
    return <Install />;
}

const SerpPreview = () => {
  const { extension } = useFormSidebarExtension();

  console.log('extension', extension);

  return (
    <>
      <h3>Side bar</h3>
      <div>Hello world</div>
    </>
  );
};

function Install() {
    const { updateInstallation } = useApp();

    return (
        <button
            onClick={() => updateInstallation({ status: 'COMPLETED', config: {} })}
        >
            Install App
        </button>
    );
}

export default function GoogleSerpPreview() {
    return (
        <Wrapper>
            <Setup />
        </Wrapper>
    );
}