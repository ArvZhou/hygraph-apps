'use client'
import { useCallback } from 'react';
import { useFieldExtension } from '@hygraph/app-sdk-react';
import EpicAssetPickerWrapper from '../../../components/epic-asset-picker/wrapper';
import Button from '../../../components/field/button';

const CompletePage = () => {
  const { name, value, onChange, openDialog, extension } = useFieldExtension();

  const showAssetDialog = useCallback(async () => {
    const res = await openDialog('/epic-asset-picker/field/assetDialog', {
      ariaLabel: 'Asset dialog',
      maxWidth: '1024px',
      disableOverlayClick: true,
      value,
      config: extension.config
    });

    if (res) {
        onChange(res);
    }
}, [openDialog, onChange, value, extension]);

  return (
    <Button onClick={showAssetDialog}>{`Add ${name}`}</Button>
  );
}

export default function Field() {
  return (
    <EpicAssetPickerWrapper>
      <CompletePage />
    </EpicAssetPickerWrapper>
  );
}