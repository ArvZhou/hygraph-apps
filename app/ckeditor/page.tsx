'use client'
import { Box, Typography } from '@mui/material';
import CKEditorWrapper from '../../components/ckeditor/wrapper';

export default function MyCustomField() {
    return (
        <CKEditorWrapper>
            <Box sx={{ width: '100%', padding: 10 }}>
                <Typography variant="h4" gutterBottom>
                    Congratulations
                </Typography>
                <Typography variant="body1" gutterBottom>
                    You have successfully installed the ckeditor application, now you can use it in Schema/<b>Add Fields</b>.
                </Typography>
            </Box>
        </CKEditorWrapper>
    );
}