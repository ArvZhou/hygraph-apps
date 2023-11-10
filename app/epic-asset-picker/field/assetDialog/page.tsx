

'use client'
import { useEffect, useState } from 'react';
import { Wrapper, useUiExtensionDialog } from '@hygraph/app-sdk-react';

function AssetDialog() {
    const { value, onCloseDialog, config } = useUiExtensionDialog();
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        const getAssets = async () => {
            const response = await fetch(
                `http://localhost:3001/api/epic/getAssets?fullPath=${config.workspace}`
            );
            const assets = await response.json();

            console.log('assets', assets);

            setAssets(assets);
        }

        getAssets();
    }, [config])

    return 'welcome to asset dialog'
}

export default function Field() {
    return (
        <Wrapper>
            <AssetDialog />
        </Wrapper>
    );
}