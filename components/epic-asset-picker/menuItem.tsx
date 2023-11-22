import { useCallback, useEffect, useRef, useState, createContext, MutableRefObject, useContext } from 'react';
import { FolderOpen, FolderClose, Loading as LoadingIcon } from '@/components/icons';

import styles from './index.module.css';

const MenuItemContext = createContext<{
    currentKeys: string[],
    setCurrentKeys: (arg: string[] | ((arg1: string[]) => string[])) => void
}>({
    currentKeys: [],
    setCurrentKeys: arg => {new Error('setCurrentKeys is not init!')}
});
export interface ItemInterface {
    key?: string,
    keyValue?: string,
    label?: string,
    getChildren: () => Promise<ItemInterface[]>,
    auto: boolean,
    parent?: MutableRefObject<{
        setChildrenAssets: () => void;
    } | null>,
    loopLevel?: number
}

const MenuItem = (
    {
        keyValue='root',
        label,
        getChildren,
        auto,
        parent,
        loopLevel=0
    }: ItemInterface) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(auto);
    const [children, setChildren] = useState<ItemInterface[]>([]);
    const {currentKeys, setCurrentKeys} = useContext(MenuItemContext);

    const itemRef= useRef<{
        setChildrenAssets: () => void
    } | null>(null);

    const addCurrentKey = useCallback(() => {
        setCurrentKeys(currentKeys => {
            const keys: string[] = new Array(loopLevel + 1).fill('');

            return keys.map((_, index) => index < (keys.length - 1) ? currentKeys[index] : keyValue);
        })
    }, [loopLevel, keyValue, setCurrentKeys])

    const removeCurrentKey = useCallback(() => {
        setCurrentKeys(currentKeys => {
            const keys: string[] = new Array(loopLevel).fill('');

            return keys.map((_, index) => currentKeys[index]);
        })
    }, [setCurrentKeys, loopLevel])

    const setChildrenAssets = useCallback(async () => {
        setLoading(true);
        setChildren(await getChildren());
        setLoading(false);
        addCurrentKey();
    }, [getChildren, addCurrentKey])

    const toggleChildren = useCallback(() => {
        if (isOpen && parent?.current?.setChildrenAssets) {
            parent.current.setChildrenAssets();
            removeCurrentKey();

            return;
        }

        setChildrenAssets();
    }, [setChildrenAssets, parent, isOpen, removeCurrentKey])

    useEffect(() => {
        auto && setChildrenAssets();
    }, [auto, setChildrenAssets])

    useEffect(() => {
        itemRef.current = { setChildrenAssets }
    }, [setChildrenAssets])

    useEffect(() => {
        setIsOpen(currentKeys[loopLevel] === keyValue);
    }, [currentKeys, loopLevel, keyValue])

    return (
        <>
            <li
                onClick={toggleChildren}
                className={styles.menuItem}
                title={label}
                data-is-open={isOpen}
            >
                {isOpen ? <FolderOpen /> : <FolderClose />}
                {label}
            </li>
            { loading ? <div className={styles.menuLoading}><LoadingIcon /></div> : ''}
            {
                children.length ? <ul data-is-open={isOpen} className={styles.menu}>
                    {children.map(({ key, label, getChildren }) => (
                        <MenuItem
                            key={key}
                            keyValue={key}
                            label={label}
                            getChildren={getChildren}
                            auto={false}
                            parent={itemRef}
                            loopLevel={loopLevel + 1}
                        />
                    ))}
                </ul> : ''
            }
        </>
    )
}

const MenuItemWrapper = (props: ItemInterface) => {
    const [currentKeys, setCurrentKeys] = useState<string[]>(['root']);

    return (
        <MenuItemContext.Provider value={{ currentKeys, setCurrentKeys }}>
            <MenuItem {...props} />
        </MenuItemContext.Provider>
    )
}

export default MenuItemWrapper