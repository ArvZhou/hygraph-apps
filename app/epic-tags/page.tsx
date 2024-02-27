'use client'
import { Wrapper, useApp, useFieldExtension } from '@hygraph/app-sdk-react';
import { useCallback, useState, createContext, useContext, Dispatch, SetStateAction, useMemo, useEffect } from 'react';
import { useTimeoutFn } from 'react-use'; 
import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Box, Divider, IconButton, InputBase, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import DelIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { getArrayFormJsonStr, removeItemWithIndex } from '@/utils';
import { AddTagButton, EditTagButton, Item } from '@/components/epic-tags';
import { ConfirmProvider, useConfirm } from 'material-ui-confirm';

interface PageContextInte {
  update: boolean,
  setUpdate?: Dispatch<SetStateAction<boolean>>
}
type Config = { tags: string }

const PageContext = createContext<PageContextInte>({ update: false });

function Setup() {
  const { installation } = useApp();
  const { update } = useContext(PageContext);

  if (installation.status === 'COMPLETED' && !update) {
    return <Compelete />;
  }

  return <ConfirmProvider><Install /></ConfirmProvider>;
}

const Install = () => {
  const { updateInstallation } = useApp();
  const { extension, installation } = useFieldExtension();
  const [loading, setLoading] = useState(false);
  const { setUpdate } = useContext(PageContext);
  const config = useMemo(() => extension?.config as Config | null, [extension])
  const defaultTags = useMemo<string[]>(() => getArrayFormJsonStr(config?.tags || ''), [config?.tags])
  const [tags, setTags] = useState(defaultTags);
  const [filter, setFilter] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const confirm = useConfirm();

  const [isReady, cancel, reset] = useTimeoutFn(() => {
    setShowAlert(false);
  }, 3000);

  useEffect(() => {
    return () => {
      cancel();
    }
  }, [cancel])
  useEffect(() => { setTags(defaultTags) }, [defaultTags])

  const handleDelete = useCallback(async () => {
    await confirm({ title: 'Confirm', description: <span>Are you sure to delete this tags <strong>{selectedTags.join(',')}</strong>!</span> });
    setTags((tags) => tags.filter(tag => !selectedTags.includes(tag)));
    setSelectedTags([]);
  }, [confirm, selectedTags])

  const handleAdd = useCallback((tag: string) => {
    if (tags.includes(tag)) {
      setShowAlert(true);
      reset();

      return;
    }
  
    setTags([...tags, tag]);
  }, [reset, tags])

  const handleEdit = useCallback((newTagName: string) => {
    if (tags.includes(newTagName)) {
      setShowAlert(true);
      reset();

      return;
    }

    setSelectedTags(([prewTag]) => {
      setTags(tags => tags.map(tag => tag === prewTag ? newTagName : tag));
      return [];
    })
  }, [reset, tags])

  const toggleSelect = (tag: string) => {
    setSelectedTags(tags => {
      if (tags.includes(tag)) {
        return removeItemWithIndex(tags, tags.indexOf(tag));
      }
      return [...tags, tag];
    })
  }

  const installTags = useCallback(async () => {
    setLoading(true);
    await updateInstallation({ status: 'COMPLETED', config: { tags: JSON.stringify(tags) } });
    setLoading(false);
    setUpdate?.(false);
  }, [setUpdate, updateInstallation, tags]);

  return (
    <Box sx={{ width: '100%', padding: 10 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to use epic tags app
      </Typography>
      {installation.status !== 'COMPLETED' && (
        <Typography variant="body1" gutterBottom>
          After you install the tags application, you can find the corresponding field about tags in schema fields, then you can use it to add tags.
        </Typography>
      )}
      <Divider />
      <Box sx={{ paddingTop: 1 }}>
        <Typography variant="h6" gutterBottom>
          Manage tags
        </Typography>
        <Box display="flex">
          <InputBase
            sx={{ border: '1px rgba(0, 0, 0, 0.12) solid', pl: 1 }}
            placeholder="Filter"
            inputProps={{ 'aria-label': 'Filter' }}
            onChange={e => {
              setFilter(e.target.value);
              setSelectedTags([]);
            }}
          />
          <AddTagButton onOk={handleAdd} />
          <EditTagButton onOk={handleEdit} disabled={selectedTags.length !== 1} currentTag={selectedTags[0]}/>
          <IconButton onClick={handleDelete} disabled={selectedTags.length === 0}>
            <DelIcon />
          </IconButton>
        </Box>
        {showAlert && !isReady() && (
          <Alert
            severity="warning"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  cancel();
                  setShowAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
              This tag has already existed.
          </Alert>)}
        <Grid container spacing={1} paddingTop={1}>
          {
            tags
              .filter(tag => tag.indexOf(filter) > -1)
              .map(tag => {
                return (
                  <Grid xs={3} md={3} key={tag}>
                    <Item active={selectedTags.includes(tag)} onClick={() => toggleSelect(tag)}>{tag}</Item>
                  </Grid>
                )
              })
          }
        </Grid>
      </Box>
      <LoadingButton
        variant="contained"
        size='large'
        sx={{ marginTop: 3 }}
        loading={loading}
        onClick={installTags}
      >
        {installation.status === 'COMPLETED' ? 'Update' : 'Install'}  epic tags
      </LoadingButton>
    </Box>
  )
}

const Compelete = () => {
  const { setUpdate } = useContext(PageContext);

  return (
    <Box sx={{ width: '100%', padding: 10 }}>
      <Typography variant="h4" gutterBottom>
        Congratulations
      </Typography>
      <Typography variant="body1" gutterBottom>
        You have successfully installed the tags application, now you can use it in Schema/<b>Add Fields</b>.
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

export default function Page() {
  const [update, setUpdate] = useState(false);

  return (
    <Wrapper>
      <PageContext.Provider value={{ update, setUpdate }}>
        <Setup />
      </PageContext.Provider>
    </Wrapper>
  );
}