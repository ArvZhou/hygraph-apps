

'use client'
import { useState, useCallback } from 'react';
import { Wrapper, useUiExtensionDialog } from '@hygraph/app-sdk-react';
import MenuItem, { ItemInterface } from '@/components/epic-asset-picker/menuItem';

import styles from './index.module.css';

// mock data
import mockData from './mock.json';
interface UseUiExtensionDialogConfig {
    workspace: string
}
export interface Asset {
    path: string,
    file?: boolean,
    name?: string,
    thumbnails?: {
        url: string
    },
    url?: string
}

function AssetDialog() {
    const { value, onCloseDialog, config } = useUiExtensionDialog<any, Record<string, UseUiExtensionDialogConfig>>();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [current, setCurrent] = useState<Asset | null>(null);

    const fetchAssets = (path: string) => {
        return new Promise((reslove) => {
            setTimeout(() => {
                reslove(mockData);
            }, 3000);
        })
    }

    console.log('value', value);

    const getChildren: () => Promise<ItemInterface[]> = useCallback(async () => {
        const assets = (await fetchAssets(`/${config.workspace}`)) as Asset[];

        setAssets(assets.filter(({ file }) => file));
        return assets.filter(({ file }) => !file).map(({ name, path }) => ({
            key: name + path,
            auto: false,
            label: name,
            getChildren: () => (fetchAssets(`${path}/name`)) as Promise<ItemInterface[]>
        }))
    }, [])

    return (
        <article className={styles.assetDialogArticle}>
            <header className={styles.assetDialogHeader}>
                <h3>Select Asset</h3>
            </header>
            <main className={styles.assetDialogMainContent}>
                <aside>
                    <nav className={styles.assetDialogNav}>
                        <MenuItem getChildren={() => getChildren()} auto={true} label="Root" />
                    </nav>
                </aside>
                <section className={styles.assetDialogItemsWrapper}>
                    <ul className={styles.assetDialogList}>
                        {assets.map((asset) => {
                            const { name, path, thumbnails, url } = asset;

                            return (
                                <li
                                    className={styles.assetDialogListItem}
                                    key={name + path}
                                    onClick={() => setCurrent(asset)}
                                    data-selected={current?.name === name && current?.path === path}
                                    title={name}
                                >
                                    {(thumbnails?.url || url) && <img src={thumbnails?.url || url} alt='Asset image' />}
                                    <span className={styles.assetDialogListItemLabel}>{name}</span>
                                </li>
                            )
                        })}
                    </ul>
                </section>
            </main>
            <footer className={styles.assetDialogFooter}>
                <button onClick={() => onCloseDialog(null)}>Cancel</button>
                <button onClick={() => onCloseDialog(current)}>Select</button>
            </footer>
        </article>
    )
}

export default function Field() {
    return (
        <Wrapper>
            <AssetDialog />
        </Wrapper>
    );
}