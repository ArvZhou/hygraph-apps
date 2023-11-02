
'use client'
import { Wrapper, useUiExtensionDialog } from '@hygraph/app-sdk-react';

export default function MyCustomField() {
    const { onCloseDialog, question } = useUiExtensionDialog();

    return (
        <Wrapper>
            <div onClick={() => onCloseDialog('test')}>Empty</div>
        </Wrapper>
    );
}