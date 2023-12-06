'use client'
import { useCallback } from 'react';
import { useFieldExtension, Wrapper } from '@hygraph/app-sdk-react';
import Button from '@/components/field/button';
import { AssetIcon, DeleteIcon, FileIcon } from '@/components/icons';
import Image from '@/components/image';

import styles from './index.module.css';

const FieldContent = () => {
  const { name, value, onChange, openDialog, extension, installation } = useFieldExtension();

  const showAssetDialog = useCallback(async () => {
    const pickedAsset = await openDialog('/epic-asset-picker/field/assetDialog', {
      ariaLabel: 'Asset Picker Dialog',
      maxWidth: `${Math.max(0.6 * window.screen.width, 1280)}px`,
      disableOverlayClick: true,
      value,
      config: extension.config
    });

    if (pickedAsset) {
      onChange(pickedAsset);
    }
  }, [openDialog, onChange, value, extension]);

  if (installation.status !== 'COMPLETED') {
    return <p>Please complete the configuration of the App</p>
  }

  return (
    <div className={styles.valueWrapper}>
      {
        value ? (
          <div className={styles.value}>
            <div className={styles.valueName}>
              <div className={styles.imgWrapper}>
                <Image
                  src={value.thumbnails?.url || value.url}
                  alt='Asset image'
                  error={<FileIcon />}
                />
              </div>
              <span>{value.name}</span>
            </div>
            <div className={styles.valueButton} onClick={() => onChange(null)}>
              <DeleteIcon />
            </div>
          </div>
        ) : ''
      }
      <Button onClick={showAssetDialog} icon={<AssetIcon />}>{`${value ? 'Replace' : 'Add'} ${name}`}</Button>
    </div>
  );
}

export default function Field() {
  return (
    <Wrapper>
      <FieldContent />
    </Wrapper>
  );
}