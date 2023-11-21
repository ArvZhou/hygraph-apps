'use client'
import { useCallback } from 'react';
import { useFieldExtension } from '@hygraph/app-sdk-react';
import EpicAssetPickerWrapper from '../../../components/epic-asset-picker/wrapper';
import Button from '../../../components/field/button';

const CompletePage = () => {
  const { name, value, onChange, openDialog, extension } = useFieldExtension();

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