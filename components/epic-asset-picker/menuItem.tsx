import { useCallback, useEffect, useState } from 'react';
import { FolderOpen, FolderClose, Loading as LoadingIcon } from '@/components/icons';

import styles from './index.module.css';

export interface ItemInterface {
    key?: string,
    auto: boolean,
    label?: string,
    getChildren: () => Promise<ItemInterface[]>
}

const MenuItem = (
    {
        label,
        getChildren,
        auto
    }: ItemInterface & {
        getChildren: (path: string) => Promise<ItemInterface[]>,
        auto: boolean
    }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [children, setChildren] = useState<ItemInterface[]>([]);

    const setChildrenAssets = useCallback(async () => {
        if (children.length) {
            setIsOpen(open => {
                console.log('open value is', open);

                return !open;
            });

            return;
        }

        setLoading(true);
        setChildren(await getChildren());
        setLoading(false);
        setIsOpen(true);
    }, [getChildren, children])

    useEffect(() => {
        if (auto) {
            setChildrenAssets();
            console.log('why get children');
        }
    }, [auto, setChildrenAssets])

    return (
        <>
            <li
                onClick={setChildrenAssets}
                className={styles.menuItem}
            >
                {isOpen ? <FolderOpen /> : <FolderClose />}
                {label}
            </li>
            { loading ? <div className={styles.menuLoading}><LoadingIcon /></div> : ''}
            {
                children.length ? <ul data-is-open={isOpen} className={styles.menu}>
                    {children.map(({ key, label }) => (
                        <MenuItem
                            key={key}
                            label={label}
                            getChildren={getChildren}
                            auto={false}
                        />
                    ))}
                </ul> : ''
            }
        </>
    )
}

export default MenuItem