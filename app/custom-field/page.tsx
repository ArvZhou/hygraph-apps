// this is the complete code
'use client'
import { useState, useEffect, Fragment, Component } from 'react';
import {
    Wrapper,
    useApp,
    useFieldExtension,
} from '@hygraph/app-sdk-react';

let CKComponent = (props: {data: string, onChange: (arg0: any, arg1: any) => void}) => <p>CKEditor is not init!</p>

const importCK = async () => {
    const { CKEditor  } = await import('@ckeditor/ckeditor5-react');
    const { default: ClassicEditor } = await import('@ckeditor/ckeditor5-build-classic');

    return {CKEditor, ClassicEditor};
}

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
    const [ckLoaded, setCkLoaded] = useState(false);

    useEffect(() => {
        const initCK = async () => {
            const { CKEditor, ClassicEditor } = await importCK();

            CKComponent = function CK(props) {
                return <CKEditor editor={ClassicEditor} {...props} />
            }

            setCkLoaded(true);
        }
        initCK() 
    }, [value])

    useEffect(() => {
        try {
            onChange(localValue);
        } catch (error) {
            console.error('Error: please use it in real field.', error);
        }
    }, [localValue, onChange]);

    return ckLoaded ? (
                <CKComponent
                    data={value || ''}
                    onChange={(_, editor) => {
                        setLocalValue(editor.getData());
                    }}
                />
        ) : '...';
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