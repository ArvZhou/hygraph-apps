'use client'
import { useFieldExtension, useUiExtensionDialog } from '@hygraph/app-sdk-react';
import { useDebouncedCallback } from 'use-debounce';

import CKEditorWrapper from '../../../components/ckeditor/wrapper';
import CKEditor4 from '../../../components/ckeditor/editor4';

function CKEditorFieldVersion4() {
    const { value, onChange, openDialog } = useFieldExtension();
    const debounced = useDebouncedCallback(onChange, 500);

    console.log(localStorage.getItem('test'));

    return (
        <CKEditor4
            value={value || ''}
            onChange={(data: any) => debounced(data)}
            onMaximize={(event) => {
                const dialog = openDialog('http://localhost:3000/asset-picker/field', {ariaLabel: 'test'});
                console.log('dialog', dialog, event, event.stop);
                event.stop();
                return;
            }}
        />)
}

export default function MyCustomField() {


    return (
        <CKEditorWrapper>
            <CKEditorFieldVersion4 />
        </CKEditorWrapper>
    );
}