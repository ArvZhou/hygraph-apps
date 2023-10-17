'use client'
import { useState, useEffect } from 'react';
import {
    Wrapper,
    useApp,
    useFieldExtension,
} from '@hygraph/app-sdk-react';
import { useDebouncedCallback } from 'use-debounce';

import styles from './index.module.css'

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
    const [ckLoaded, setCkLoaded] = useState(false);

    const debounced = useDebouncedCallback(
        value => onChange(value),
        1000
      );

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

function Install() {
    const { updateInstallation } = useApp();

    return (
        <button
            className={styles.installButton}
            onClick={() => updateInstallation({ status: 'COMPLETED', config: {} })}
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