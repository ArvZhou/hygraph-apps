'use client'
import {
    Wrapper,
    useApp,
    useFieldExtension
} from '@hygraph/app-sdk-react';
import { useCallback, useState, Dispatch, SetStateAction, createContext, useContext } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { useForm, Controller } from 'react-hook-form';

interface PageContextInte {
    update: boolean,
    setUpdate?: Dispatch<SetStateAction<boolean>>
}

const PageContext = createContext<PageContextInte>({
    update: false
});

function Setup() {
    const { installation } = useApp();
    const { update } = useContext(PageContext);

    if (installation.status === 'COMPLETED' && !update) {
        return <CompeltePage />;
    }

    return <Install />;
}

function Install() {
    const { updateInstallation } = useApp();
    const [loading, setLoading] = useState(false);
    const { extension } = useFieldExtension();
    const { setUpdate } = useContext(PageContext);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            workspace: extension?.config?.workspace as string || '',
            environment: extension?.config?.environment as string || '',
        }
    });

    const onSubmit = useCallback(async (data: { workspace: string, environment: string }) => {
        setLoading(true);
        await updateInstallation({ status: 'COMPLETED', config: data });
        setLoading(false);
        setUpdate?.(false);
    }, [updateInstallation, setUpdate])

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
                                fullWidth
                                error={!!errors.workspace}
                                helperText={errors.workspace?.type === 'required' ? 'Workspace can not be empty.' : ''}
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
                                <InputLabel id="demo-simple-select-label" error={!!errors.environment}>Choose Environment</InputLabel>
                                <Select
                                    {...field}
                                    labelId="demo-simple-select-label"
                                    label="Choose Environment"
                                    variant='outlined'
                                    defaultValue='cisandbox'
                                    error={!!errors.environment}
                                    fullWidth
                                >
                                    <MenuItem value='cisandbox'>CI Sandbox</MenuItem>
                                    <MenuItem value='ci'>CI</MenuItem>
                                    <MenuItem value='gamedev'>Game Dev</MenuItem>
                                    <MenuItem value='prod'>Production</MenuItem>
                                </Select>
                                {errors.environment?.type === 'required' ? <FormHelperText error>Environment can not be empty.</FormHelperText> : ''}
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

const CompeltePage = () => {
    const { updateInstallation } = useApp();
    const { setUpdate } = useContext(PageContext);

    return (
        <Box sx={{ width: '100%', padding: 10 }}>
            <Typography variant="h4" gutterBottom>
                Congratulations
            </Typography>
            <Typography variant="body1" gutterBottom>
                You have successfully installed the epic asset picker application, now you can use it in Schema/<b>Add Fields</b>.
            </Typography>
            <LoadingButton
                variant="outlined"
                size='large'
                sx={{ marginTop: 3 }}
                onClick={() => { updateInstallation({ status: 'PENDING' }); setUpdate?.(true) }}
            >
                Update Configuration
            </LoadingButton>
        </Box>
    );
}

export default function Page() {
    const [update, setUpdate] = useState(false);

    return (
        <Wrapper>
            <PageContext.Provider value={{update, setUpdate}}>
                <Setup />
            </PageContext.Provider>
        </Wrapper>
    );
}