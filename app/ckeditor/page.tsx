'use client'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CKEditorWrapper from '../../components/ckeditor/wrapper';

const CompeltePage = () => {
    return (
        <Box sx={{ width: '100%', padding: 10 }}>
            <Typography variant="h4" gutterBottom>
                Congratulations
            </Typography>
            <Typography variant="body1" gutterBottom>
                You have successfully installed the ckeditor application, now you can use it in Schema/<b>Add Fields</b>.
            </Typography>
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