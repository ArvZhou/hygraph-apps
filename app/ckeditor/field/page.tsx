'use client'
import { useFieldExtension } from '@hygraph/app-sdk-react';
import { useDebouncedCallback } from 'use-debounce';

import CKEditorWrapper from '../../../components/ckeditor/wrapper';
import CKEditor4 from '../../../components/ckeditor/editor4';

function CKEditorFieldVersion4() {
    const { value, onChange } = useFieldExtension();
    const debounced = useDebouncedCallback(onChange, 500);

    return (
        <CKEditor4
            value={value || ''}
            onChange={(data: any) => debounced(data)}
        />)
}

export default function MyCustomField() {
    return (
        <CKEditorWrapper>
            <CKEditorFieldVersion4 />
        </CKEditorWrapper>
    );
}