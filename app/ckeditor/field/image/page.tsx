
'use client'
import { Wrapper, useUiExtensionDialog } from '@hygraph/app-sdk-react';

import styles from './index.module.css';

function ImagePicker() {
    const { onCloseDialog } = useUiExtensionDialog();

    return (
        <div className={styles.dialogWrapper}>
            <div className={styles.dialogTitle}>Select image library</div>
            <ul className={styles.dialogArticle}>
                <li>
                    <button type="button" onClick={() => onCloseDialog('Hygraph')}>Choose from Hygraph asset</button>
                </li>
                <li>
                    <button type="button" onClick={() => onCloseDialog('epicCMS')}>Choose from Epic CMS asset</button>
                </li>
            </ul>
        </div>
    )
}

export default function Field() {
    return (
        <Wrapper>
            <ImagePicker />
        </Wrapper>
    );
}