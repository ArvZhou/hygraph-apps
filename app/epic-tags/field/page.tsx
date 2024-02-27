'use client'
import { Wrapper, useFieldExtension } from '@hygraph/app-sdk-react';
import { KeyboardEventHandler, useCallback, useMemo, useRef, useState } from 'react';
import { getArrayFormJsonStr, getArrayFormStr, removeItemWithIndex } from '@/utils';
import { RemoveIcon } from '@/components/icons';

import styles from './index.module.css';
import { DropDownItem } from '@/components/epic-tags';

function FieldContent() {
    const inputRef = useRef<HTMLInputElement>(null);
    const { value, extension, onChange } = useFieldExtension();
    const [input, setInput] = useState<string>('');
    const [showDropList, setShowDropList] = useState<boolean>(false);

    const selectedTags = useMemo<string[]>(() => getArrayFormStr(value, ','), [value]);
    const allTags = useMemo<string[]>(() => getArrayFormJsonStr(extension?.config?.tags as string), [extension?.config?.tags]);

    const filterTags = useMemo(() => {
        return allTags.filter((tag) => {
            return selectedTags.indexOf(tag) === -1 && String(tag).indexOf(input) > -1
        })
    }, [allTags, input, selectedTags])

    const addTag = useCallback((tag: string) => {
        onChange(([...selectedTags, tag]).join(','));
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        setInput('');
    }, [onChange, selectedTags])

    const removeTag = useCallback((index: number) => {
        onChange(removeItemWithIndex(selectedTags, index).join(',') || null);
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

    const handleRemoveClick = useCallback((e: {
        preventDefault: () => void,
        stopPropagation: () => void
    },index: number) => {
        e.preventDefault();
        e.stopPropagation();
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
                    onFocus={() => setShowDropList(true)}
                    onBlur={() => setTimeout(() => setShowDropList(false), 300)}
                />
            </div>
            {
                showDropList && (
                    <div className={styles.droplist}>
                        {
                            filterTags.map((tag: string) => {
                                return (
                                    <DropDownItem
                                        key={tag}
                                        onClick={() => addTag(tag)}
                                    >
                                        {tag}
                                    </DropDownItem>
                                )
                            })
                        }
                    </div>
                )
            }
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