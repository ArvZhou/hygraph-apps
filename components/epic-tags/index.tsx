import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import Popover from "@mui/material/Popover";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { KeyboardEventHandler, useCallback, useMemo, useRef, useState } from "react";
import { styled } from '@mui/material/styles';

const StyledEditLabel = styled(Paper)(({ theme }) => ({
    backgroundColor: '#f0f0f0',
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    boxShadow: 'unset',
    borderRadius: 0
}));

export function TagButton(props: {
    onOk: (arg: string) => void,
    currentTag?: string,
    disabled?: boolean,
    type?: string
}) {
    const { onOk, type='Add', disabled=false, currentTag } = props;
    const inputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef(null);
    const [open, setOpen] = useState(false);

    const handleAdd = useCallback(() => {
        const inputEle = inputRef.current as HTMLInputElement;
        setOpen(false);

        if (inputEle.value) {
            onOk(inputEle.value);
            inputEle.value = '';
        }
    }, [onOk])

    const handleEnter: KeyboardEventHandler<HTMLInputElement> = useCallback(e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    }, [handleAdd])

    const handleCancel = () => {
        (inputRef.current as HTMLInputElement).value = '';
        setOpen(false);
    }

    return (
        <>
            <div ref={buttonRef} style={{ width: 'fit-content' }}>
                <IconButton aria-label={`${type} Tag`} onClick={() => setOpen(true)} disabled={disabled}>
                    { type === 'Add' && <AddIcon />}
                    { type === 'Edit' && <EditIcon />}
                </IconButton>
            </div>
            <Popover
                open={open}
                anchorEl={buttonRef.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                {type=== 'Edit' && <StyledEditLabel>{currentTag}</StyledEditLabel>}
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder={`${type} Tag`}
                        inputProps={{ 'aria-label': `${type} Tag` }}
                        inputRef={inputRef}
                        onKeyDown={handleEnter}
                    />
                    <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={handleAdd}>
                        <CheckIcon />
                    </IconButton>
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                    <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={handleCancel}>
                        <ClearIcon />
                    </IconButton>
                </Paper>
            </Popover>
        </>
    )
}

export function AddTagButton(props: {
    onOk: (arg: string) => void
}) {
    return <TagButton {...props} />
}

export function EditTagButton(props: {
    onOk: (arg: string) => void,
    currentTag: string,
    disabled: boolean
}) {
    return <TagButton {...props} type="Edit" />
}

export const Item = ({active=false, onClick, children}: {
    active: boolean,
    children: React.ReactNode | string,
    onClick?: () => void
}) => {
    const StyledPaper = useMemo(()=> styled(Paper)(({ theme }) => ({
        backgroundColor: active ? '#e0e0e0' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#e0e0e0',
        }
    })), [active])

    return <StyledPaper onClick={onClick}>{children}</StyledPaper>
}

export const DropDownItem = ({onClick, children}: {
    children: React.ReactNode | string,
    onClick?: () => void
}) => {
    const StyledPaper = styled(Paper)(({ theme }) => ({
        backgroundColor: '#fff',
        padding: theme.spacing(0.8),
        textAlign: 'left',
        color: theme.palette.text.secondary,
        cursor: 'pointer',
        marginBottom: 1,
        lineHeight: 1,
        height: '28px',
        border: '1px #f0f0f0 solid',
        boxShadow: 'unset',
        '&:hover': {
            backgroundColor: '#e0e0e0',
        }
    }))

    return <StyledPaper onClick={onClick}>{children}</StyledPaper>
}