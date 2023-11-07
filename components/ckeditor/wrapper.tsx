'use client'
import {
    Wrapper,
    useApp
} from '@hygraph/app-sdk-react';
import { Button, Box, Typography } from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function Setup({children=<></>}) {
    const { installation } = useApp();

    if (installation.status === 'COMPLETED') {
        return children;
    }
    return <Install />;
}

function Install() {
    const { updateInstallation } = useApp();

    return (
        <Box sx={{ width: '100%', padding: 10 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to use ckeditor app
            </Typography>
            <Typography variant="body1" gutterBottom>
                After you install the ckeditor application, you can find the corresponding field about ckeditor in schema fields, so that you can use it to edit documents in ckeditor.
            </Typography>
            <Button
                variant="outlined"
                sx={{ marginTop: 3 }}
                onClick={() => updateInstallation({ status: 'COMPLETED', config: {} })}
            >
                Install ckeditor app
            </Button>
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