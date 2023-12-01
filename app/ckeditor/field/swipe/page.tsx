
'use client'
import { useCallback, useRef, useState } from 'react';
import { Wrapper, useUiExtensionDialog } from '@hygraph/app-sdk-react';

import { AssetContent, Asset } from '@/app/epic-asset-picker/field/assetDialog/page';
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
        const cover = dialogRef.current?.querySelector('[data-preview-cover]') as HTMLElement;
        const slider = dialogRef.current?.querySelector('[data-preview-slider]') as HTMLElement;
        const previewBox = dialogRef.current?.querySelector('[data-preview-box]') as HTMLElement;
        const min = previewBox.offsetLeft;
        const max = previewBox.clientWidth;

        const handler = (e: MouseEvent) => {
            let pos = e.clientX - min;
            if (pos < -1) {
                pos = -1;
            } else if (pos > max) {
                pos = max;
            }

            if (cover?.style) {
                cover.style.width=`${pos}px`;
            }

            if (slider?.style) {
                slider.style.left=`${pos}px`;
            }
        };
        // $(window.document).on('mousemove', handler).one('mouseup', () => $(window.document).off('mousemove', handler));
        console.log('===> addEventListener');
        document.addEventListener('mousemove', handler);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', handler);
        }, {
            once: true
        })
    }, [])

    const setAsset = useCallback((asset: Asset | null) => {
        if (!asset) {
            setCurrentAssetdialog(null);

            return;
        }

        if (currentAssetDialog === 'left') {
            setLeftAsset(asset);
        }

        if (currentAssetDialog === 'right') {
            setRightAsset(asset);
        }

        setCurrentAssetdialog(null);
    }, [currentAssetDialog])

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
                <button onClick={() => onCloseDialog([leftAsset, rightAsset])} disabled={!leftAsset || !rightAsset}>Select</button>
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