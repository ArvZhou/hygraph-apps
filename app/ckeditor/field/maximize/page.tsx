
'use client'
import { useState } from 'react';
import { Wrapper, useUiExtensionDialog } from '@hygraph/app-sdk-react';

import CKEditor4 from '@/components/ckeditor/editor4';

function CKEditorFieldVersion4() {
    const { value, onCloseDialog } = useUiExtensionDialog();
    const [richText, setRichText] = useState<string>(value as string);

    return (
        <CKEditor4
            name="ckeditorFieldMaximize"
            value={richText || ''}
            onChange={(data: any) => setRichText(data)}
            onMaximize={(_: any, data: string) => onCloseDialog(data)}
            config={{ height: 450, full: true }}
            isMaximize
        />)
}

export default function Field() {
    return (
        <Wrapper>
            <CKEditorFieldVersion4 />
        </Wrapper>
    );
}