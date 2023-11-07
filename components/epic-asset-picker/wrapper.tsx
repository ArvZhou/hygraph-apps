'use client'
import {
    Wrapper,
    useApp
} from '@hygraph/app-sdk-react';
import { Button, Box, Typography, Input, Select, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function Setup({ children = <></> }) {
    const { installation } = useApp();

    if (installation.status === 'COMPLETED') {
        return children;
    }
    return <Install />;
}

function Install() {
    const { updateInstallation } = useApp();
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            username: '',
            password: '',
            environment: '',
        }
    });
    const onSubmit = (data: object) => console.log(data);

    return (
        <Box sx={{ width: '100%', padding: 10 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to use epic asset picker
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="username"
                    control={control}
                    rules={{required: true}}
                    render={({ field }) => <Input {...field} />}
                />
                <Controller
                    name="environment"
                    control={control}
                    rules={{required: true}}
                    render={({ field }) => (
                        <Select {...field}>
                            <MenuItem value={'cisandbox'}>CI Sandbox</MenuItem>
                            <MenuItem value={'ci'}>CI</MenuItem>
                            <MenuItem value={'gamedev'}>Game Dev</MenuItem>
                            <MenuItem value={'prod'}>Production</MenuItem>
                        </Select>
                    )}
                />
                <Button
                    variant="outlined"
                    sx={{ marginTop: 3 }}
                    disabled={!!errors}
                >
                    Install epic asset picker
                </Button>
            </form>
        </Box>
    );
}

export default function CKEditorWrapper({ children = <></> }) {
    return (
        <Wrapper>
            <Setup>{children}</Setup>
        </Wrapper>
    );
}