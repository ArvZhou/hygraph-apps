'use client'
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Tree, { ItemInterface, TreeRef } from '@/components/epic-asset-picker/tree';
import Image from '@/components/image';
import { FileIcon, EmptyIcon, Loading as LoadingIcon, Folder } from '@/components/icons';
import { CSM_ENV, CSM_DOMAINS } from '@/constants';
import { isImageFile } from '@/utils';

import styles from './index.module.css';

export interface AssetDialogConfig {
    workspace: string,
    environment: string,
    image?: boolean
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

function AssetContent({onChange, environment, workspace, image}: {
    onChange: (arg: Asset | null) => void
} & AssetDialogConfig) {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [current, setCurrent] = useState<Asset | null>(null);
    const [currentFile, setCurrentFile] = useState<Asset | null>(null);
    const [loading, setloading] = useState<boolean>(false);
    const treeRef = useRef<TreeRef>(null);

    const fetchAssets = useCallback(async (path: string) => {
        setloading(true);
        const response = await fetch(`https://${CSM_ENV[environment as keyof CSM_DOMAINS]}/asset/getAssetTree?fullPath=${encodeURIComponent(path)}&isHygraph=true`);
        const data = await response.json();
        setloading(false);

        return data
    }, [environment])

    const handleChildren: (path: string) => () => Promise<ItemInterface[]> = useCallback((path) => {
        let assets: Asset[] = [];

        return async () => {
            if (!assets?.length) {
                const data = (await fetchAssets(path)) as Asset[];

                assets = data.sort((a, b) => a.name?.localeCompare(b.name || '') || 0);
            }
            

            setAssets(assets);
            setCurrentFile(null);
            return assets.map(asset => {
                const { name, path, file } = asset;
                const assetCanBeChoose = isImageFile(name || '') || !image;

                return {
                    key: name + path,
                    auto: false,
                    label: name,
                    getChildren: handleChildren(`${path}/${name}`),
                    isFile: !!file,
                    openFile: assetCanBeChoose ? () => setCurrentFile(asset) : null
                }
            })
        }
    }, [fetchAssets, image])

    const getRootChildren = useMemo(() => handleChildren(`/${workspace}`), [handleChildren, workspace])

    const select = useCallback(() => {
        if (currentFile) {
            onChange(currentFile);

            return;
        }
        if (current) onChange(current)
    }, [onChange, current, currentFile])

    const openFolder = useCallback(({name, path}: Asset) => {
        treeRef.current?.setActiveFolder?.(name + path);
    }, [])

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
                        const { name, path, thumbnails, url, file } = asset;
                        const assetCanBeChoose = isImageFile(name || '') || !image;

                        if (file) {
                            return (
                                <li
                                    className={styles.assetDialogListItem}
                                    key={name + path}
                                    onClick={assetCanBeChoose ? () => setCurrent(asset) : () => void 0}
                                    data-selected={current?.name === name && current?.path === path}
                                    data-disabled={!assetCanBeChoose}
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
                        }

                        return (
                            <li
                                className={styles.assetDialogListItem}
                                key={name + path}
                                onClick={() => openFolder(asset)}
                                data-selected={current?.name === name && current?.path === path}
                                title={name}
                            >
                                <Folder />
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
                This folder is empty !
            </section>
        )
    }, [currentFile, assets, current?.name, current?.path, loading, openFolder, image])

    return (
        <article className={styles.assetDialogArticle}>
            <header className={styles.assetDialogHeader}>
                <h3>Select Asset</h3>
            </header>
            <main className={styles.assetDialogMainContent}>
                <aside>
                    <nav className={styles.assetDialogNav}>
                        <Tree
                            getChildren={getRootChildren}
                            auto={true}
                            label="Root"
                            isFile={false}
                            treeRef={treeRef}
                        />
                    </nav>
                </aside>
                <section className={styles.assetDialogItemsWrapper}>
                    {assetsBody}
                </section>
            </main>
            <footer className={styles.assetDialogFooter}>
                <button onClick={() => onChange(null)}>Cancel</button>
                <button onClick={select} disabled={!currentFile && !current}>Select</button>
            </footer>
        </article>
    )
}

export default AssetContent