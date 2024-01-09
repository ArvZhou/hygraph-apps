'use client'
import {
    Wrapper,
    useApp,
    useFieldExtension
} from '@hygraph/app-sdk-react';
import { useCallback, useState, createContext, useContext, Dispatch, SetStateAction, useMemo, useEffect, forwardRef } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Controller } from 'react-hook-form';
import {
    Button, Box, Typography, Select, MenuItem,
    TextField, InputLabel, FormHelperText, FormControl,
    Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { ConfirmProvider, useConfirm } from "material-ui-confirm";
import { EmptyIcon } from '@/components/icons';
interface PageContextInte {
    update: boolean,
    setUpdate?: Dispatch<SetStateAction<boolean>>
}

type Config = { workspace: string, environment: string, domainsConfig: string }
type Domain = { name: string, url: string, validUrl: string };
type Domains = Domain[];

const PageContext = createContext<PageContextInte>({
    update: false
});

function Setup() {
    const { installation } = useApp();
    const { update } = useContext(PageContext);

    if (installation.status === 'COMPLETED' && !update) {
        return <Compelete />;
    }
    return <Install />;
}

function Install() {
    const { updateInstallation } = useApp();
    const { extension, installation } = useFieldExtension();
    const { setUpdate } = useContext(PageContext);
    const [loading, setLoading] = useState(false);

    const config = useMemo(() => extension.config as Config | null, [extension])

    const defaultDomains = useMemo<Domains>(() => {
        if (!config?.domainsConfig) {
            return [];
        }

        try {
            return JSON.parse(config.domainsConfig);
        } catch (error) {
            console.error('Parse domains config error:', error);
            return [];
        }
    }, [config?.domainsConfig])


    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            workspace: config?.workspace || '',
            environment: config?.environment || '',
            domainsConfig: defaultDomains
        }
    });

    const onSubmit = useCallback(async (data: { workspace: string, environment: string, domainsConfig: Domains }) => {
        setLoading(true);
        await updateInstallation({ status: 'COMPLETED', config: { ...data, domainsConfig: JSON.stringify(data.domainsConfig) } });
        setLoading(false);
        setUpdate?.(false);
    }, [updateInstallation, setUpdate])

    return (
        <Box sx={{ width: '100%', padding: 10 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to use ckeditor app
            </Typography>
            <Typography variant="body1" gutterBottom>
                After you install the ckeditor application, you can find the corresponding field about ckeditor in schema fields, so that you can use it to edit documents in ckeditor.
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ width: '380px', padding: '40px 0 20px' }}>
                    <Controller
                        name="workspace"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <TextField
                                    {...field}
                                    label="Input Workspace Name"
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.workspace}
                                    helperText={errors.workspace?.type === 'required' ? 'Workspace can not be empty.' : ''}
                                />
                            </FormControl>
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
                                    fullWidth
                                    error={!!errors.environment}
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
                <Box sx={{ width: '100%', padding: '0 0 20px' }}>
                    <Controller
                        name="domainsConfig"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <WhiteDomain {...field} />
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
                    {installation.status === 'COMPLETED' ? 'Update' : 'Install'} epic ckeditor
                </LoadingButton>
            </form>
        </Box>
    );
}

const Compelete = () => {
    const { setUpdate } = useContext(PageContext);

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
                onClick={() => setUpdate?.(true)}
            >
                Update Configuration
            </LoadingButton>
        </Box>
    )
}

const WhiteDomain = forwardRef(function WD({ value, onChange }: {
    value: Domains,
    onChange: (arg: Domains) => void
}, ref) {
    const [domains, setDomains] = useState<Domains>([]);
    const [showAdd, setShowAdd] = useState<boolean>(false);
    const confirm = useConfirm();

    const addNewDomain = useCallback((data: Domain) => {
        onChange([data, ...domains]);
        setShowAdd(false);
    }, [onChange, domains])

    const remove = useCallback(async (row: Domain) => {
        const index = domains.indexOf(row);

        await confirm({ title: 'Confirm', description: "Are you sure to delete this domain!" });
        onChange([...domains.slice(0, index), ...domains.slice(index + 1, Infinity)]);
    }, [onChange, domains, confirm])

    const updateDomain = useCallback(async (newDomain: Domain, index: number) => {
        onChange([...domains.slice(0, index), newDomain, ...domains.slice(index + 1, Infinity)]);
    }, [onChange, domains])

    useEffect(() => { setDomains(value) }, [value])

    return (
        <>
            <Box justifyContent="space-between" display="flex" paddingBottom="7px">
                <Typography variant="subtitle2" gutterBottom paddingBottom="7px">
                    White Domains
                </Typography>
                <Button onClick={() => setShowAdd(true)} variant="contained" startIcon={<AddIcon />}>
                    Add new white domain
                </Button>
            </Box>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 400 }}>
                    <Table stickyHeader size="small" aria-label="domains config table">
                        <TableHead>
                            <TableRow>
                                <TableCell width="20%">Name</TableCell>
                                <TableCell width="30%">Url</TableCell>
                                <TableCell width="30%">Valid Url</TableCell>
                                <TableCell width="20%" align='center'>Action</TableCell>
                            </TableRow>
                            {
                                showAdd && <DomainEdition onOk={addNewDomain} cancel={() => setShowAdd(false)} />
                            }
                        </TableHead>
                        <TableBody>
                            {domains.map((row, index) => (
                                <WhiteCol
                                    key={row.name}
                                    remove={remove}
                                    updateDomain={(newDomain) => updateDomain(newDomain, index)}
                                    row={row}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {!domains.length && !showAdd && <Box display='flex' justifyContent='center'><EmptyIcon /></Box>}
            </Paper>
        </>
    )
})

const WhiteCol = ({ row, updateDomain, remove }: {
    row: Domain,
    updateDomain: (arg: Domain) => void,
    remove: (arg: Domain) => void
}) => {
    const [isEdit, setIsEdit] = useState(false);
    const onOk = useCallback((newDomain: Domain) => {
        setIsEdit(false);
        updateDomain(newDomain)
    }, [updateDomain])

    if (isEdit) {
        return <DomainEdition onOk={onOk} cancel={() => setIsEdit(false)} defaultValue={row} />
    }

    return (
        <TableRow key={row.name}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.url}</TableCell>
            <TableCell>{row.validUrl}</TableCell>
            <TableCell align='center'>
                <Button onClick={() => remove(row)}><Delete color='warning' /></Button>
                <Button onClick={() => setIsEdit(true)}><Edit color='action' /></Button>
            </TableCell>
        </TableRow>
    )
}

const DomainEdition = ({ cancel, onOk, defaultValue }: {
    cancel: () => void,
    onOk: (arg: Domain) => void,
    defaultValue?: Domain
}) => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: defaultValue || { name: '', url: '', validUrl: '' }
    });

    const onSave = useCallback((data: Domain) => {
        onOk(data);
    }, [onOk])

    return (
        <TableRow>
            <TableCell>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <TextField
                                {...field}
                                label="Input Domain Name"
                                size='small'
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.type === 'required' ? 'Name can not be empty.' : ''}
                            />
                        </FormControl>
                    )}
                />
            </TableCell>
            <TableCell>
                <Controller
                    name="url"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <TextField
                                {...field}
                                label="Input Domain url"
                                size='small'
                                fullWidth
                                error={!!errors.url}
                                helperText={errors.url?.type === 'required' ? 'Url can not be empty.' : ''}
                            />
                        </FormControl>
                    )}
                />
            </TableCell>
            <TableCell>
                <Controller
                    name="validUrl"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Input Domain valid url"
                            size='small'
                            fullWidth
                            error={!!errors.validUrl}
                            helperText={errors.validUrl?.type === 'required' ? 'Valid url can not be empty.' : ''}
                        />
                    )}
                />
            </TableCell>
            <TableCell align='center'>
                <Button onClick={cancel} color='inherit'>Cancel</Button>
                <Button onClick={handleSubmit(onSave)}>Ok</Button>
            </TableCell>
        </TableRow>
    )
}

export default function Page() {
    const [update, setUpdate] = useState(false);

    return (
        <Wrapper>
            <PageContext.Provider value={{ update, setUpdate }}>
                <ConfirmProvider>
                    <Setup />
                </ConfirmProvider>
            </PageContext.Provider>
        </Wrapper>
    );
}