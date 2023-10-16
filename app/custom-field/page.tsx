// this is the complete code
'use client'
import { useState, useEffect } from 'react';
import {
    Wrapper,
    useApp,
    useFieldExtension,
} from '@hygraph/app-sdk-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function Setup() {
    const { installation } = useApp();

    if (installation.status === 'COMPLETED') {
        return <CustomField />;
    }
    return <Install />;
}

function CustomField() {
    const { value, onChange } = useFieldExtension();
    const [localValue, setLocalValue] = useState(value || '');


    useEffect(() => {
        try {
            onChange(localValue);
        } catch (error) {
            console.error('Error: please use it in real field.', error);
        }
    }, [localValue, onChange]);

    return (

        <CKEditor
            editor={ClassicEditor}
            data={value || ''}
            onChange={(event, editor) => {
                const data = editor.getData();

                setLocalValue(data);
            }}
        />
    );
}

function Install() {
    const { updateInstallation } = useApp();

    return (
        <button
            onClick={() => {
                updateInstallation({ status: 'COMPLETED', config: {} });
            }}
        >
            Install App
        </button>
    );
}

export default function MyCustomField() {
    return (
        <Wrapper>
            <Setup />
        </Wrapper>
    );
}