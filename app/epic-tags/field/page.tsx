'use client'
import { Wrapper, useFieldExtension } from '@hygraph/app-sdk-react';
import { KeyboardEventHandler, MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getArrayFormStr } from '@/utils';
import { RemoveIcon } from '@/components/icons';

import styles from './index.module.css';

function FieldContent() {
    const inputRef = useRef<HTMLInputElement>(null);
    const { value, extension, onChange } = useFieldExtension();
    const [input, setInput] = useState<string>('');

    const selectedTags = useMemo<string[]>(() => getArrayFormStr(value) as [], [value]);
    const allTags = useMemo<string[]>(() => getArrayFormStr(extension?.config?.tags as string) as [], [extension?.config?.tags]);

    const filterTags = useMemo(() => {
        if (!input) return [];

        return allTags.filter(tag => {
            return selectedTags.indexOf(tag) === -1 && String(tag).indexOf(input) > -1
        })
    }, [allTags, input, selectedTags])

    const addTag = useCallback((tag: string) => {
        onChange(JSON.stringify([...selectedTags, tag]));
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        setInput('');
    }, [onChange, selectedTags])

    const removeTag = useCallback((index: number) => {
        onChange(JSON.stringify([...selectedTags.slice(0, index), ...selectedTags.slice(index + 1, Infinity)]));
    }, [onChange, selectedTags])

    const removeLastTag = useCallback(() => {
        removeTag(selectedTags.length - 1);
    }, [selectedTags, removeTag])

    const handleKeyEvent: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
        if (e.key === 'Enter' && allTags.indexOf(input) > -1) {
            addTag(input);
        }

        if (e.key === 'Backspace' && !input) {
            removeLastTag();
        }
    }, [allTags, input, addTag, removeLastTag])

    const handleRemoveClick = useCallback((e: { preventDefault: () => void },index: number) => {
        e.preventDefault();
        removeTag(index);
    }, [removeTag])

    return (
        <div className={styles.fieldWrapper}>
            <div className={styles.fieldTags} onClick={() => inputRef.current?.focus()}>
                {
                    selectedTags.map((option: string, index: number) => {
                        return (
                            <div className={styles.fieldTag} key={option}>
                                {option}
                                <RemoveIcon onClick={(event) => handleRemoveClick(event, index)} />
                            </div>
                        )
                    })
                }
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.inputTag}
                    onKeyDown={handleKeyEvent}
                    onChange={({ currentTarget }) => setInput(currentTarget.value)}
                />
            </div>
            <div className={styles.droplist}>
                {
                    filterTags.map((tag: string) => {
                        return (
                            <div
                                key={tag}
                                className={styles.tagItem}
                                onClick={() => addTag(tag)}
                            >
                                {tag}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default function Field() {
    return (
        <Wrapper>
            <FieldContent />
        </Wrapper>
    )
}