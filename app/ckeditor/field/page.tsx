'use client'
import { useCallback } from 'react';
import { useFieldExtension } from '@hygraph/app-sdk-react';
import { useDebouncedCallback } from 'use-debounce';

import CKEditorWrapper from '../../../components/ckeditor/wrapper';
import CKEditor4 from '../../../components/ckeditor/editor4';

function CKEditorFieldVersion4() {
    const { value, onChange, openDialog } = useFieldExtension();
    const debounced = useDebouncedCallback(onChange, 500);

    const onMaximize = useCallback(async (_:any, data: string) => {
        const res = await openDialog('/ckeditor/field/maximize', {
            ariaLabel: 'Cheditor maximize',
            maxWidth: '1024px',
            disableOverlayClick: true,
            value: data
        });

        if (res) {
            onChange(res);
        }
    }, [openDialog, onChange]);

    return (
        <CKEditor4
            value={value || ''}
            config={{full: true}}
            onChange={(data: any) => debounced(data)}
            onMaximize={onMaximize}
        />)
}

export default function Field() {
    return (
        <CKEditorWrapper>
            <CKEditorFieldVersion4 />
        </CKEditorWrapper>
    );
}