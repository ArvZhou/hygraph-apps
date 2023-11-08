'use client'
import { useCallback } from 'react';
import { useFieldExtension } from '@hygraph/app-sdk-react';
import EpicAssetPickerWrapper from '../../../components/epic-asset-picker/wrapper';
import Button from '../../../components/field/button';

const CompeltePage = () => {
  const { name, value, onChange, openDialog, extension } = useFieldExtension();

    return (
        <Button onClick={() => ''}>{`Add ${name}`}</Button>
    );
}

export default function Field() {
    return (
        <EpicAssetPickerWrapper>
            <CompeltePage />
        </EpicAssetPickerWrapper>
    );
}