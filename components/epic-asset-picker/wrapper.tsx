'use client'
import {
    Wrapper,
    useApp
} from '@hygraph/app-sdk-react';
import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useForm, Controller } from 'react-hook-form';

function Setup({ children = <></> }) {
    const { installation } = useApp();

    if (installation.status === 'COMPLETED') {
        return children;
    }
    return <Install />;
}

function Install() {
    const { updateInstallation } = useApp();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            workspace: '',
            environment: '',
        }
    });

    const onSubmit = (data: { workspace: string, environment: string }) => {
        updateInstallation({ status: 'COMPLETED', config: data });
        setLoading(true);
    }

    return (
        <Box sx={{ width: '100%', padding: 10 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to use epic asset picker
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ width: '380px', padding: '40px 0 20px' }}>
                    <Controller
                        name="workspace"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Input Workspace Name"
                                variant="outlined"
                                required
                                fullWidth
                            />
                        )}
                    />
                </Box>
                <Box sx={{ width: '240px', padding: '0 0 20px' }}>
                    <Controller
                        name="environment"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Choose Environment</InputLabel>
                                <Select
                                    {...field}
                                    labelId="demo-simple-select-label"
                                    label="Choose Environment"
                                    variant='outlined'
                                    defaultValue='cisandbox'
                                    fullWidth
                                    required
                                >
                                    <MenuItem value='cisandbox'>CI Sandbox</MenuItem>
                                    <MenuItem value='ci'>CI</MenuItem>
                                    <MenuItem value='gamedev'>Game Dev</MenuItem>
                                    <MenuItem value='prod'>Production</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    />
                </Box>
                <LoadingButton
                    variant="contained"
                    size='large'
                    sx={{ marginTop: 3 }}
                    type="submit"
                    loading={loading}
                >
                    Install epic asset picker
                </LoadingButton>
            </form>
        </Box>
    );
}

export default function EpicAssetPickerWrapper({ children = <></> }) {
    return (
        <Wrapper>
            <Setup>{children}</Setup>
        </Wrapper>
    );
}