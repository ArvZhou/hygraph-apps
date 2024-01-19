
'use client'
import { Wrapper, useUiExtensionDialog } from '@hygraph/app-sdk-react';

import styles from './index.module.css';

function ImagePicker() {
    const { onCloseDialog } = useUiExtensionDialog();

    return (
        <ul className={styles.dialogArticle}>
            <li>
                <button type="button" onClick={() => onCloseDialog('Hygraph')}>Choose from Hygraph</button>
            </li>
            <li>
                <button type="button" onClick={() => onCloseDialog('epicCMS')}>Choose from Epic CMS</button>
            </li>
        </ul>
    )
}

export default function Field() {
    return (
        <Wrapper>
            <ImagePicker />
        </Wrapper>
    );
}