

'use client'
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Wrapper, useUiExtensionDialog } from '@hygraph/app-sdk-react';
import MenuItem, { ItemInterface } from '@/components/epic-asset-picker/menuItem';
import Image from '@/components/image';
import { FileIcon, EmptyIcon, Loading as LoadingIcon } from '@/components/icons';
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
    const [currentFile, setCurrentFile] = useState<Asset | null>(null);
    const [loading, setloading] = useState<boolean>(false);

    const fetchAssets = useCallback(async (path: string) => {
        setloading(true);
        const response = await fetch(`https://${CSM_ENV[config.environment as keyof CSM_DOMAINS]}/asset/getAssetTree?fullPath=${encodeURIComponent(path)}&isHygraph=true`);
        const data = await response.json();
        setloading(false);

        return data
    }, [config.environment])

    const handleChildren: (path: string) => () => Promise<ItemInterface[]> = useCallback((path) => {
        let assets: Asset[] = [];

        return async () => {
            if (!assets?.length) {
                const data = (await fetchAssets(path)) as Asset[];
                assets = data.sort((a, b) => a.name?.localeCompare(b.name || '') || 0);
            }
            

            setAssets(assets.filter(({ file }) => file));
            setCurrentFile(null);
            return assets.map(asset => {
                const { name, path, file } = asset;

                return {
                    key: name + path,
                    auto: false,
                    label: name,
                    getChildren: handleChildren(`${path}/${name}`),
                    isFile: !!file,
                    openFile: () => setCurrentFile(asset)
                }
            })
        }
    }, [fetchAssets])

    const firstGetChildren = useMemo(() => handleChildren(`/${config.workspace}`), [handleChildren, config.workspace])

    const select = useCallback(() => {
        if (currentFile) {
            onCloseDialog(currentFile);

            return;
        }
        if (current) onCloseDialog(current)
    }, [onCloseDialog, current, currentFile])

    useEffect(() => {
        setCurrent(null);
    }, [assets])

    const assetsBody = useMemo(() => {
        if (loading) {
            return (
                <div className={styles.loadingWrapper}>
                    <LoadingIcon />
                </div>
            )
        }

        if (currentFile) {
            const { name, thumbnails, url } = currentFile;

            return (
                <div className={`${styles.assetDialogListItem} ${styles.assetDialogListItemSingle}`} title={name}>
                    {(thumbnails?.url || url) && (
                        <Image
                            src={thumbnails?.url || url}
                            alt='Asset image'
                            error={<FileIcon />}
                        />)}
                    <span className={styles.assetDialogListItemLabel}>{name}</span>
                </div>
            )
        }

        if (assets.length) {
            return (
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
            )
        }

        return (
            <section className={styles.emptyWrapper}>
                <EmptyIcon />
                This folder is empty!
            </section>
        )
    }, [currentFile, assets, current?.name, current?.path, loading])

    return (
        <article className={styles.assetDialogArticle}>
            <header className={styles.assetDialogHeader}>
                <h3>Select Asset</h3>
            </header>
            <main className={styles.assetDialogMainContent}>
                <aside>
                    <nav className={styles.assetDialogNav}>
                        <MenuItem getChildren={firstGetChildren} auto={true} label="Root" isFile={false} />
                    </nav>
                </aside>
                <section className={styles.assetDialogItemsWrapper}>
                    {assetsBody}
                </section>
            </main>
            <footer className={styles.assetDialogFooter}>
                <button onClick={() => onCloseDialog(null)}>Cancel</button>
                <button onClick={select} disabled={!currentFile && !current}>Select</button>
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