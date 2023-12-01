'use client'
import { Wrapper, useUiExtensionDialog } from '@hygraph/app-sdk-react';
import AssetContent, { AssetDialogConfig } from './AssetContent';

function AssetDialog() {
    const { onCloseDialog, config } = useUiExtensionDialog<any, Record<string, AssetDialogConfig>>();

    return <AssetContent onChange={onCloseDialog} {...config} />
}

export default function Field() {
    return (
        <Wrapper>
            <AssetDialog />
        </Wrapper>
    );
}