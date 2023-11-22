

'use client'
import { useState, useCallback, useMemo } from 'react';
import { Wrapper, useUiExtensionDialog } from '@hygraph/app-sdk-react';
import MenuItem, { ItemInterface } from '@/components/epic-asset-picker/menuItem';
import Image from '@/components/image';
import { FileIcon, EmptyIcon } from '@/components/icons';
import { CSM_ENV, CSM_DOMAINS } from '@/constants';

import styles from './index.module.css';
interface UseUiExtensionDialogConfig {
    workspace: string,
    environment: string
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

    const fetchAssets = useCallback(async (path: string) => {
        const response = await fetch(`https://${CSM_ENV[config.environment as keyof CSM_DOMAINS]}/asset/getAssetTree?fullPath=${encodeURIComponent(path)}&isHygraph=true`);
        const data = await response.json();

        return data
    }, [])

    const handleChildren: (path: string) => () => Promise<ItemInterface[]> = useCallback((path) => {
        let assets: Asset[] = [];

        return async () => {
            if (!assets?.length) {
                assets = (await fetchAssets(path)) as Asset[];
            }

            setAssets(assets.filter(({ file }) => file));
            return assets.filter(({ file }) => !file).map(({ name, path }) => ({
                key: name + path,
                auto: false,
                label: name,
                getChildren: handleChildren(`${path}/${name}`),
                callback: setAssets
            }))
        }
    }, [fetchAssets])

    const firstGetChildren = useMemo(() => handleChildren(`/${config.workspace}`), [handleChildren, config.workspace])

    const select = useCallback(() => {
        if (!current) return;

        onCloseDialog(current)
    }, [onCloseDialog, current])

    return (
        <article className={styles.assetDialogArticle}>
            <header className={styles.assetDialogHeader}>
                <h3>Select Asset</h3>
            </header>
            <main className={styles.assetDialogMainContent}>
                <aside>
                    <nav className={styles.assetDialogNav}>
                        <MenuItem getChildren={firstGetChildren} auto={true} label="Root" />
                    </nav>
                </aside>
                <section className={styles.assetDialogItemsWrapper}>
                    {
                        assets.length ? (
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
                                            {(thumbnails?.url || url) && (
                                                <Image
                                                    src={thumbnails?.url || url}
                                                    alt='Asset image'
                                                    error={<FileIcon />}
                                                />)}
                                            <span className={styles.assetDialogListItemLabel}>{name}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : (
                            <section className={styles.emptyWrapper}>
                                <EmptyIcon />
                                There is no file in this folder !!!
                            </section>
                        )
                    }
                </section>
            </main>
            <footer className={styles.assetDialogFooter}>
                <button onClick={() => onCloseDialog(null)}>Cancel</button>
                <button onClick={select}>Select</button>
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