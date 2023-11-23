import { useCallback, useEffect, useRef, useState, createContext, MutableRefObject, useContext } from 'react';
import { FolderOpen, FolderClose, Loading as LoadingIcon, FileIcon } from '@/components/icons';

import styles from './index.module.css';

const MenuItemContext = createContext<{
    currentKeys: string[],
    setCurrentKeys: (arg: string[] | ((arg1: string[]) => string[])) => void,
    currentFile: string | null,
    setCurrentFile: (arg: string | null | ((arg1: string | null) => string | null)) => void,
}>({
    currentKeys: [],
    setCurrentKeys: () => {new Error('setCurrentKeys is not init!')},
    currentFile: null,
    setCurrentFile: () => {new Error('setCurrentFile is not init!')},
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
    loopLevel?: number,
    isFile: boolean,
    openFile?: () => void
}

const MenuItem = (
    {
        keyValue='root',
        label,
        getChildren,
        auto,
        parent,
        loopLevel=0,
        isFile,
        openFile
    }: ItemInterface) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(auto);
    const [children, setChildren] = useState<ItemInterface[]>([]);
    const {currentKeys, setCurrentKeys, currentFile, setCurrentFile} = useContext(MenuItemContext);

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
        setCurrentFile(null);
        if (isOpen && parent?.current?.setChildrenAssets) {
            parent.current.setChildrenAssets();
            removeCurrentKey();

            return;
        }

        setChildrenAssets();
    }, [setChildrenAssets, parent, isOpen, removeCurrentKey, setCurrentFile])

    const fileClick = useCallback(() => {
        openFile?.();
        setCurrentFile(keyValue);
        removeCurrentKey();
    }, [openFile, keyValue, setCurrentFile, removeCurrentKey])

    useEffect(() => {
        auto && setChildrenAssets();
    }, [auto, setChildrenAssets])

    useEffect(() => {
        itemRef.current = { setChildrenAssets }
    }, [setChildrenAssets])

    useEffect(() => {
        setIsOpen(currentKeys[loopLevel] === keyValue);
    }, [currentKeys, loopLevel, keyValue])

    if (isFile) {
        return <li className={styles.menuItem} onClick={fileClick} data-is-open={currentFile === keyValue}><FileIcon />{label}</li>
    }

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
                    {children.map(({ key, label, getChildren, isFile, openFile }) => (
                        <MenuItem
                            key={key}
                            keyValue={key}
                            label={label}
                            getChildren={getChildren}
                            auto={false}
                            parent={itemRef}
                            loopLevel={loopLevel + 1}
                            isFile={isFile}
                            openFile={openFile}
                        />
                    ))}
                </ul> : ''
            }
        </>
    )
}

const MenuItemWrapper = (props: ItemInterface) => {
    const [currentKeys, setCurrentKeys] = useState<string[]>(['root']);
    const [currentFile, setCurrentFile] = useState<string | null>(null);

    return (
        <MenuItemContext.Provider value={{ currentKeys, setCurrentKeys, currentFile, setCurrentFile }}>
            <MenuItem {...props} />
        </MenuItemContext.Provider>
    )
}

export default MenuItemWrapper