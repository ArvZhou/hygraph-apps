'use client'
import { Wrapper, useApp, useFieldExtension } from '@hygraph/app-sdk-react';
import { useCallback, useState, createContext, useContext, Dispatch, SetStateAction, useMemo, useEffect, useRef, KeyboardEventHandler } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Chip, Divider, IconButton, InputBase, Paper, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

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

  return <Install />;
}

const Install = () => {
  const { updateInstallation } = useApp();
  const { extension, installation } = useFieldExtension();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setUpdate } = useContext(PageContext);
  const config = useMemo(() => extension?.config as Config | null, [extension])
  const defaultTags = useMemo<string[]>(() => {
    if (!config?.tags) {
      return [];
    }

    try {
      return JSON.parse(config.tags);
    } catch (error) {
      console.error('Parse tags config error:', error);
      return [];
    }
  }, [config?.tags])

  const [tags, setTags] = useState(defaultTags);

  useEffect(() => {
    setTags(defaultTags);
  }, [defaultTags])

  const handleDelete = useCallback((tag: string) => {
    const index = tags.indexOf(tag);

    if (index > -1) {
      setTags([...tags.slice(0, index), ...tags.slice(index + 1, Infinity)]);
    }
  }, [tags])

  const handleAdd = useCallback(() => {
    if (!inputRef.current) return;
  
    const inputValue = inputRef.current?.value;

    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    inputRef.current.value = '';
  }, [tags])

  const handleEnter:KeyboardEventHandler<HTMLInputElement> = useCallback(e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  }, [handleAdd])

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
      {installation.status !== 'COMPLETED'  && (
        <Typography variant="body1" gutterBottom>
          After you install the tags application, you can find the corresponding field about tags in schema fields, then you can use it to add tags.
        </Typography>
      )}
      <Box>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Add Tag"
            inputProps={{ 'aria-label': 'Add Tag' }}
            inputRef={inputRef}
            onKeyDown={handleEnter}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions" onClick={handleAdd}>
            <CheckIcon />
          </IconButton>
        </Paper>
        <Box sx={{ paddingTop: 1 }}>
          {
            tags.map(tag => {
              return <Chip key={tag} label={tag} variant="outlined" onDelete={() => handleDelete(tag)} />
            })
          }
        </Box>
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