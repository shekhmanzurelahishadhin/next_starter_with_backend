"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { useState, useRef, useEffect } from 'react';

interface TiptapEditorProps {
    onChange?: (content: string) => void;
    initialContent?: string;
    label?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
    onChange,
    initialContent = '',
    label = 'Editor'
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [headingValue, setHeadingValue] = useState('p');
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [textColor, setTextColor] = useState('#000000');
    const [highlightColor, setHighlightColor] = useState('#FFFF00');


    // create editor instance 
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc list-outside ml-4',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal list-outside ml-4',
                    },
                },
                blockquote: {
                    HTMLAttributes: {
                        class: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic',
                    },
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse border border-gray-300 dark:border-gray-600 w-full',
                },
            }),
            TableRow,
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 dark:border-gray-600 px-2 py-1',
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 dark:border-gray-600 px-2 py-1 bg-gray-100 dark:bg-gray-700',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-brand-500 underline',
                },
            }),
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),

        ],
        immediatelyRender: false,
        content: initialContent,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
        editorProps: {
            attributes: {
                class: 'mx-auto focus:outline-none min-h-[300px] p-4 text-gray-800 dark:text-white/90',

            },
        },
    });

    useEffect(() => {
        if (!editor) return;

        const updateHeadingValue = () => {
            const { state } = editor;
            const { $from } = state.selection;
            const node = $from.parent;

            if (node.type.name === 'heading') {
                setHeadingValue(`h${node.attrs.level}`);
            } else {
                setHeadingValue('p');
            }
        };

        editor.on('selectionUpdate', updateHeadingValue);
        editor.on('transaction', updateHeadingValue);

        return () => {
            editor.off('selectionUpdate', updateHeadingValue);
            editor.off('transaction', updateHeadingValue);
        };
    }, [editor]);

    // Image handling
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                editor?.chain().focus().setImage({ src: base64 }).run();
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerImageUpload = () => {
        fileInputRef.current?.click();
    };

    // Link handling
    const setLink = () => {
        if (linkUrl) {
            editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
            setLinkUrl('');
            setIsLinkModalOpen(false);
        }
    };

    const unsetLink = () => {
        editor?.chain().focus().unsetLink().run();
        setIsLinkModalOpen(false);
    };

    // Color handling
    const applyTextColor = (color: string) => {
        editor?.chain().focus().setColor(color).run();
        setTextColor(color);
        setIsColorPickerOpen(false);
    };

    const applyHighlightColor = (color: string) => {
        editor?.chain().focus().setHighlight({ color }).run();
        setHighlightColor(color);
        setIsColorPickerOpen(false);
    };

    const resetTextColor = () => {
        editor?.chain().focus().unsetColor().run();
        setTextColor('#000000');
        setIsColorPickerOpen(false);
    };

    const resetHighlightColor = () => {
        editor?.chain().focus().unsetHighlight().run();
        setHighlightColor('#FFFF00');
        setIsColorPickerOpen(false);
    };

    // Predefined color palette
    const colorPalette = [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
        '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#800080',
        '#008000', '#800000', '#008080', '#000080', '#A52A2A'
    ];

    if (!editor) {
        return (
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 min-h-[300px] flex items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400">Loading editor...</div>
            </div>
        );
    }

    // Toolbar button component
    const ToolbarButton = ({
        onClick,
        isActive = false,
        children,
        title,
        disabled = false
    }: {
        onClick: () => void;
        isActive?: boolean;
        children: React.ReactNode;
        title: string;
        disabled?: boolean;
    }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            disabled={disabled}
            className={`p-2 rounded-lg transition-colors ${disabled
                ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                : isActive
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
        >
            {children}
        </button>
    );

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}

            <div className="border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 overflow-hidden">
                {/* Main Toolbar */}
                <div className="border-b border-gray-200 dark:border-gray-700 p-3 flex flex-wrap gap-1">
                    {/* Text Formatting */}
                    <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive('bold')}
                            title="Bold"
                        >
                            <span className="font-bold text-sm">B</span>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive('italic')}
                            title="Italic"
                        >
                            <span className="italic text-sm">I</span>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            isActive={editor.isActive('underline')}
                            title="Underline"
                        >
                            <span className="underline text-sm">U</span>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            isActive={editor.isActive('strike')}
                            title="Strikethrough"
                        >
                            <span className="line-through text-sm">S</span>
                        </ToolbarButton>
                    </div>

                    {/* Color Picker */}
                    <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2 relative">
                        <ToolbarButton
                            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                            isActive={editor.isActive('textStyle') || editor.isActive('highlight')}
                            title="Text Color & Highlight"
                        >
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                    <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z" />
                                </svg>
                                <div
                                    className="w-3 h-1 rounded-sm border border-gray-300"
                                    style={{ backgroundColor: textColor }}
                                />
                                <div
                                    className="w-3 h-1 rounded-sm border border-gray-300"
                                    style={{ backgroundColor: highlightColor }}
                                />
                            </div>
                        </ToolbarButton>

                        {/* Color Picker Dropdown */}
                        {isColorPickerOpen && (
                            <div className="absolute top-12 left-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-10 p-3 min-w-64">
                                {/* Text Color Section */}
                                <div className="mb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Text Color
                                        </span>
                                        <button
                                            onClick={resetTextColor}
                                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                    <div className="flex gap-1 mb-2">
                                        <input
                                            type="color"
                                            value={textColor}
                                            onChange={(e) => applyTextColor(e.target.value)}
                                            className="w-8 h-8 cursor-pointer rounded border border-gray-300"
                                            title="Custom color"
                                        />
                                        {colorPalette.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => applyTextColor(color)}
                                                className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Highlight Color Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Highlight Color
                                        </span>
                                        <button
                                            onClick={resetHighlightColor}
                                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                    <div className="flex gap-1">
                                        <input
                                            type="color"
                                            value={highlightColor}
                                            onChange={(e) => applyHighlightColor(e.target.value)}
                                            className="w-8 h-8 cursor-pointer rounded border border-gray-300"
                                            title="Custom highlight color"
                                        />
                                        {colorPalette.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => applyHighlightColor(color)}
                                                className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Headings */}
                    <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
                        <select
                            value={headingValue}
                            onChange={(e) => {
                                const value = e.target.value;
                                setHeadingValue(value);

                                if (value === 'p') {
                                    editor.chain().focus().setParagraph().run();
                                } else {
                                    const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6;
                                    editor.chain().focus().setHeading({ level }).run();
                                }
                            }}
                            className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-sm"
                        >
                            <option value="p">Paragraph</option>
                            <option value="h1">Heading 1</option>
                            <option value="h2">Heading 2</option>
                            <option value="h3">Heading 3</option>
                            <option value="h4">Heading 4</option>
                            <option value="h5">Heading 5</option>
                            <option value="h6">Heading 6</option>
                        </select>
                    </div>

                    {/* Text Alignment */}
                    <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            isActive={editor.isActive({ textAlign: 'left' })}
                            title="Align Left"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                            </svg>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            isActive={editor.isActive({ textAlign: 'center' })}
                            title="Align Center"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                            </svg>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            isActive={editor.isActive({ textAlign: 'right' })}
                            title="Align Right"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                            </svg>
                        </ToolbarButton>
                    </div>

                    {/* Lists & Blockquote */}
                    <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor.isActive('bulletList')}
                            title="Bullet List"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                            </svg>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={editor.isActive('orderedList')}
                            title="Numbered List"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                            </svg>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            isActive={editor.isActive('blockquote')}
                            title="Blockquote"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z" />
                            </svg>
                        </ToolbarButton>
                    </div>

                    {/* Code */}
                    <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            isActive={editor.isActive('code')}
                            title="Inline Code"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4.708 5.578L2.061 8.224l2.647 2.646-.708.708-3-3V7.87l3-3 .708.708zm7-.708L11 5.578l2.647 2.646L11 10.87l.708.708 3-3V7.87l-3-3zM4.908 13v-1H4v.5a.5.5 0 0 1-.5.5H2v.5h1.5A1.5 1.5 0 0 0 4.908 13z" />
                            </svg>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            isActive={editor.isActive('codeBlock')}
                            title="Code Block"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                <path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0zm2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0z" />
                            </svg>
                        </ToolbarButton>
                    </div>

                    {/* Table */}
                    <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                            title="Insert Table"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
                            </svg>
                        </ToolbarButton>

                        {editor.isActive('table') && (
                            <>
                                <ToolbarButton
                                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                                    title="Add Column Before"
                                >
                                    +Col←
                                </ToolbarButton>

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                                    title="Add Column After"
                                >
                                    +Col→
                                </ToolbarButton>

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().deleteColumn().run()}
                                    title="Delete Column"
                                >
                                    -Col
                                </ToolbarButton>

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().addRowBefore().run()}
                                    title="Add Row Before"
                                >
                                    +Row↑
                                </ToolbarButton>

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().addRowAfter().run()}
                                    title="Add Row After"
                                >
                                    +Row↓
                                </ToolbarButton>

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().deleteRow().run()}
                                    title="Delete Row"
                                >
                                    -Row
                                </ToolbarButton>

                                <ToolbarButton
                                    onClick={() => editor.chain().focus().deleteTable().run()}
                                    title="Delete Table"
                                >
                                    ×Table
                                </ToolbarButton>
                            </>
                        )}
                    </div>

                    {/* Media */}
                    <div className="flex items-center gap-1">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <ToolbarButton
                            onClick={triggerImageUpload}
                            title="Insert Image"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                            </svg>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => setIsLinkModalOpen(true)}
                            isActive={editor.isActive('link')}
                            title="Insert Link"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                            </svg>
                        </ToolbarButton>
                    </div>

                    {/* Undo/Redo */}
                    <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-2 ml-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().undo().run()}
                            title="Undo"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z" />
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
                            </svg>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().redo().run()}
                            title="Redo"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                            </svg>
                        </ToolbarButton>
                    </div>
                </div>

                {/* Bubble Menu (appears when selecting text) */}
                {editor && (
                    <BubbleMenu
                        editor={editor}
                        className="flex gap-1 p-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg"
                    >
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive('bold')}
                            title="Bold"
                        >
                            <span className="font-bold text-sm">B</span>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive('italic')}
                            title="Italic"
                        >
                            <span className="italic text-sm">I</span>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => setIsLinkModalOpen(true)}
                            isActive={editor.isActive('link')}
                            title="Link"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                            </svg>
                        </ToolbarButton>

                        {/* Color picker in bubble menu */}
                        <div className="relative">
                            <ToolbarButton
                                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                                isActive={editor.isActive('textStyle') || editor.isActive('highlight')}
                                title="Text Color & Highlight"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                    <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z" />
                                </svg>
                            </ToolbarButton>
                        </div>
                    </BubbleMenu>
                )}

                {/* Editor Content */}
                <div className="editor-container">
                    <EditorContent editor={editor} />
                </div>

                {/* Link Modal */}
                {isLinkModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
                                Insert Link
                            </h3>
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white/90 mb-4"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setLink();
                                    }
                                }}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsLinkModalOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={unsetLink}
                                    className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                >
                                    Remove
                                </button>
                                <button
                                    onClick={setLink}
                                    className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TiptapEditor;