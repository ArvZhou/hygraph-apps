'use client'
import { useCallback } from 'react';
import { useFieldExtension, Wrapper } from '@hygraph/app-sdk-react';
import Button from '@/components/field/button';
import { AssetIcon, DeleteIcon } from '@/components/icons';

import styles from './index.module.css';
import FileTypeImage from '@/components/epic-asset-picker/fileType';
import { isVideoFile } from '@/utils';

const SingleField = ({ value, onChange, isList = false }: {
  value: any,
  onChange: (arg: any) => void,
  isList?: boolean
}) => {
  const { name, openDialog, extension } = useFieldExtension();

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

  return (
    <div className={styles.valueWrapper}>
      {
        value ? (
          <>
            <div className={styles.value}>
              <div className={styles.valueName}>
                <div className={styles.imgWrapper}>
                  <FileTypeImage url={value.thumbnails?.url || value.url}
                  />
                </div>
                <span>{value.name}</span>
              </div>
              <div className={styles.valueButton}>
                <DeleteIcon onClick={() => onChange(null)} />
              </div>
            </div>
            {
              isVideoFile(value.url) ? (
                <video src={value.url} className={styles.video} controls />
              ) :''
            }
          </>
        ) : ''
      }
      {
        !isList && <Button onClick={showAssetDialog} icon={<AssetIcon />}>{`${value ? 'Replace' : 'Add'} ${name}`}</Button>
      }
      {
        !value && isList && <Button onClick={showAssetDialog} icon={<AssetIcon />}>Add {name}</Button>
      }
    </div>
  );
}

const FieldList = () => {
  const { value, onChange } = useFieldExtension();

  const formattedValue = [...(value || []), undefined];

  const listChange = useCallback((item: any, index: number) => {
    if (item === null) {
      onChange([...value.slice(0, index), ...value.slice(index + 1, Infinity)]);

      return;
    }

    onChange([...(value || []), item])
  }, [value, onChange])

  return (
    <div className={styles.listWrapper}>
      {
        (formattedValue as Array<any>)
        .map((asset, index) => <SingleField key={asset?.name || '-'} onChange={item => listChange(item, index)} value={asset} isList />)
      }
    </div>
  )
}

const FieldContent = () => {
  const { value, onChange, installation, field } = useFieldExtension();

  if (installation.status !== 'COMPLETED') {
    return <p>Please complete the configuration of the App</p>
  }

  if (!field.isList) {
    return <SingleField onChange={onChange} value={value} />
  }

  return <FieldList />
}

export default function Field() {
  return (
    <Wrapper>
      <FieldContent />
    </Wrapper>
  );
}