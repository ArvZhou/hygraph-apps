'use client'
import {
    Wrapper,
    useApp
} from '@hygraph/app-sdk-react';
import { useCallback, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Setup({children=<></>}) {
    const { installation } = useApp();

    if (installation.status === 'COMPLETED') {
        return children;
    }
    return <Install />;
}

function Install() {
    const { updateInstallation } = useApp();
    const [loading, setLoading] = useState(false);

    const onSubmit = useCallback(() => {
        updateInstallation({ status: 'COMPLETED', config: {} });
        setLoading(true);
    }, [updateInstallation])

    return (
        <Box sx={{ width: '100%', padding: 10 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to use ckeditor app
            </Typography>
            <Typography variant="body1" gutterBottom>
                After you install the ckeditor application, you can find the corresponding field about ckeditor in schema fields, so that you can use it to edit documents in ckeditor.
            </Typography>
            <LoadingButton
                variant="outlined"
                sx={{ marginTop: 3 }}
                onClick={onSubmit}
                loading={loading}
            >
                Install ckeditor app
            </LoadingButton>
        </Box>
    );
}

export default function CKEditorWrapper({children=<></>}) {
    return (
        <Wrapper>
            <Setup>{children}</Setup>
        </Wrapper>
    );
}