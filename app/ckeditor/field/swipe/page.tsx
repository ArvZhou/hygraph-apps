
'use client'
import { useCallback, useRef, useState } from 'react';
import { Wrapper, useUiExtensionDialog } from '@hygraph/app-sdk-react';

import AssetContent, { Asset } from '@/app/epic-asset-picker/field/assetDialog/AssetContent';
import { LFArrow } from '@/components/icons';
import styles from './index.module.css';

export interface SwipeDialogConfig {
    environment: string,
    workspace: string
}

function SwipeDialog() {
    const { onCloseDialog, config } = useUiExtensionDialog<any, Record<string, SwipeDialogConfig>>();
    const [ leftAsset, setLeftAsset ] = useState<Asset | null>(null);
    const [ rightAsset, setRightAsset ] = useState<Asset | null>(null);
    const [ currentAssetDialog, setCurrentAssetdialog] = useState<'left' | 'right' | null>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);

    const AssetPicker = useCallback(({ onChange }: {
        onChange: (arg: Asset | null) => void
    }) => {
        return (
            <div className={styles.assetPicker}>
                <AssetContent
                    onChange={onChange}
                    environment={config.environment}
                    workspace={config.workspace}
                    image={true}
                />
            </div>
        )
    }, [config.environment, config.workspace])

    const onSliderMouseDown = useCallback(() => {
        const dialogEle = dialogRef.current as HTMLElement;
        const [cover, slider, box] = ['cover', 'slider', 'box'].map(name => dialogEle.querySelector(`[data-preview-${name}]`) as HTMLElement);
        const [min, max] = [box.offsetLeft, box.clientWidth];

        const handler = (e: MouseEvent) => {
            const pos = Math.min(Math.max(e.clientX - min, -1), max);

            cover.style.width=`${pos}px`;
            slider.style.left=`${pos}px`;
        };
        document.addEventListener('mousemove', handler);
        document.addEventListener('mouseup', () => document.removeEventListener('mousemove', handler), { once: true })
    }, [])

    const setAsset = useCallback((asset: Asset | null) => {
        setCurrentAssetdialog(null);

        if (!asset) return;

        if (currentAssetDialog === 'left') {
            setLeftAsset(asset);
        }

        if (currentAssetDialog === 'right') {
            setRightAsset(asset);
        }
    }, [currentAssetDialog])

    const onOk = useCallback(() => {
        if (leftAsset && rightAsset) {
            onCloseDialog([{ src: leftAsset.url, alt: leftAsset.name }, { src: rightAsset.url, alt: rightAsset.name }]);

            return;
        }
        onCloseDialog(null);
    }, [onCloseDialog, leftAsset, rightAsset])

    return (
        <div className={styles.dialogWrapper} ref={dialogRef}>
            <div className={styles.dialogTitle}>Create swipe shots</div>
            <div className={styles.imagesBox}>
                <div>
                    <div className={styles.image} style={{backgroundImage: `url('${leftAsset?.url}')`}} onClick={() => setCurrentAssetdialog('left')}>
                        {!leftAsset?.url && <div className={styles.empty}>Left Image</div>}
                    </div>
                </div>
                <div>
                    <div className={styles.image} style={{backgroundImage: `url('${rightAsset?.url}')`}} onClick={() => setCurrentAssetdialog('right')}>
                        {!rightAsset?.url && <div className={styles.empty}>Right Image</div>}
                    </div>
                </div>
            </div>
            <div className={styles.previewBox} data-preview-box>
                {leftAsset?.url && rightAsset?.url ? (
                    <>
                        <div className={styles.previewCover} data-preview-cover><div className={styles.image} style={{backgroundImage: `url('${leftAsset?.url}')`}} /></div>
                        <div className={styles.image} style={{backgroundImage: `url('${rightAsset?.url}')`}} />
                        <div className={styles.previewSlider} data-preview-slider onMouseDown={onSliderMouseDown}>
                            <span><LFArrow /></span>
                        </div>
                    </>
                ) : <div className={styles.empty}>Preview</div>}
            </div>
            <footer className={styles.dialogFooter}>
                <button onClick={() => onCloseDialog(null)}>Cancel</button>
                <button onClick={onOk} disabled={!leftAsset || !rightAsset}>Ok</button>
            </footer>
            {currentAssetDialog && <AssetPicker onChange={setAsset} />}
        </div>
    )
}

export default function Field() {
    return (
        <Wrapper>
            <SwipeDialog />
        </Wrapper>
    );
}