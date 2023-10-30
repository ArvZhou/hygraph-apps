'use client'
import { useState, useEffect } from 'react';
import { useFieldExtension } from '@hygraph/app-sdk-react';
import { useDebouncedCallback } from 'use-debounce';

import CKEditorWrapper from '../../../components/ckeditor/wrapper';

let CKComponent = (props: {data: string, onChange: (arg0: any, arg1: any) => void}) => <p>CKEditor is not init!</p>

const importCK = async () => {
    const { CKEditor  } = await import('@ckeditor/ckeditor5-react');
    const { default: ClassicEditor } = await import('@ckeditor/ckeditor5-build-classic');

    return {CKEditor, ClassicEditor};
}

function CustomField() {
    const { value, onChange } = useFieldExtension();
    const [ckLoaded, setCkLoaded] = useState(false);

    const debounced = useDebouncedCallback(onChange, 1000);

    useEffect(() => {
        const initCK = async () => {
            const { CKEditor, ClassicEditor } = await importCK();

            CKComponent = function CK(props) {
                return <CKEditor editor={ClassicEditor} {...props} />
            }

            setCkLoaded(true);
        }
        initCK() 
    }, [])

    if (!ckLoaded) {
        return '...';
    }

    return (
        <CKComponent
            data={value || ''}
            onChange={(_, editor) => debounced(editor.getData())}
        />)
}

export default function MyCustomField() {
    return (
        <CKEditorWrapper>
            <CustomField />
        </CKEditorWrapper>
    );
}