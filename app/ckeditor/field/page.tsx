'use client'
import { useCallback } from 'react';
import { useFieldExtension, Wrapper } from '@hygraph/app-sdk-react';
import { useDebouncedCallback } from 'use-debounce';

import CKEditor4 from '@/components/ckeditor/editor4';
import { isImageMimeType } from '@/utils';

function CKEditorFieldVersion4() {
    const { value, onChange, openDialog, extension, installation, openAssetPicker } = useFieldExtension();
    const debounced = useDebouncedCallback(onChange, 500);

    const onMaximize = useCallback(async (_: any, data: string) => {
        const res = await openDialog('/ckeditor/field/maximize', {
            ariaLabel: 'Cheditor maximize',
            maxWidth: '1024px',
            disableOverlayClick: true,
            value: data,
            config: {
                whiteDomains: extension.config.domainsConfig as string
            }
        });

        if (res) {
            onChange(res);
        }
    }, [openDialog, onChange, extension.config.domainsConfig]);

    const chooseFromEpicCMS = useCallback(async() => {
        const image = await openDialog('/epic-asset-picker/field/assetDialog', {
            ariaLabel: 'Asset Picker Dialog',
            maxWidth: `${Math.max(0.6 * window.screen.width, 1280)}px`,
            disableOverlayClick: true,
            config: {
                ...extension.config,
                image: true
            }
        });

        if (!image) {
            return null;
        }

        const { url, name, width, height } = image;

        return { src: url, alt: name, width, height, title: name }
    }, [openDialog, extension.config])

    const chooseFromHygraph = useCallback(async () => {
        const asset = await openAssetPicker();

        const { mimeType='', url, width, height, fileName } = asset || {};
        if (isImageMimeType(mimeType)) {
            return { src: url, alt: fileName, width, height, title: fileName }
        }

        return null
    }, [openAssetPicker])

    const chooseImage = useCallback(async () => {
        const type = await openDialog('/ckeditor/field/image', {
            ariaLabel: 'Ckeditor image',
            maxWidth: '300px'
        });

        if (type === 'epicCMS') {
            return await chooseFromEpicCMS();
        }

        if (type === 'Hygraph') {
            return chooseFromHygraph();
        }

        return null
    }, [chooseFromEpicCMS, chooseFromHygraph, openDialog])

    const setSwipe = useCallback(() => {
        return openDialog('/ckeditor/field/swipe', {
            ariaLabel: 'Swipe Dialog',
            maxWidth: `${Math.max(0.6 * window.screen.width, 1280)}px`,
            disableOverlayClick: true,
            config: extension.config
        });
    }, [extension.config, openDialog])

    if (installation.status !== 'COMPLETED') {
        return <p>Please complete the configuration of the App</p>
    }

    return (
        <CKEditor4
            value={value || ''}
            config={{ full: true }}
            onChange={(data: any) => debounced(data)}
            onMaximize={onMaximize}
            chooseImage={chooseImage}
            setSwipe={setSwipe}
            whiteDomains={extension.config.domainsConfig as string}
        />)
}

export default function Field() {
    return (
        <Wrapper>
            <CKEditorFieldVersion4 />
        </Wrapper>
    );
}