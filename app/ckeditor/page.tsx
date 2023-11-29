'use client'
import { useCallback, useState } from 'react';
import { useApp } from '@hygraph/app-sdk-react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CKEditorWrapper from '@/components/ckeditor/wrapper';

const CompeltePage = () => {
    const [loading, setLoading] = useState(false);
    const { updateInstallation } = useApp();

    const updateStatus = useCallback(() => {
        updateInstallation({ status: 'PENDING' });
        setLoading(true);
    }, [updateInstallation])

    return (
        <Box sx={{ width: '100%', padding: 10 }}>
            <Typography variant="h4" gutterBottom>
                Congratulations
            </Typography>
            <Typography variant="body1" gutterBottom>
                You have successfully installed the ckeditor application, now you can use it in Schema/<b>Add Fields</b>.
            </Typography>
            <LoadingButton
                variant="outlined"
                size='large'
                sx={{ marginTop: 3 }}
                onClick={updateStatus}
                loading={loading}
            >
                Update Configuration
            </LoadingButton>
        </Box>
    );
}

export default function Page() {
    return (
        <CKEditorWrapper>
            <CompeltePage />
        </CKEditorWrapper>
    );
}