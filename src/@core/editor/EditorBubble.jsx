import { useState, useRef } from 'react';
import { BubbleMenu } from '@tiptap/react';
import {
  FontBoldIcon,
  FontItalicIcon,
  HeadingIcon,
  TextIcon,
  QuoteIcon,
  CodeIcon,
  Link2Icon,
  CheckIcon,
  Cross2Icon
} from '@radix-ui/react-icons';

import Show from 'src/@core/components/base/Show';
export default function EditorBubble(props) {
  const [linkPrompt, setLinkPrompt] = useState(false);
  const linkRef = useRef();
  const editor = props.editor;
  const shouldShow = obj => {
    const selection = obj.view.state.selection;
    if (
      !obj.view.hasFocus() ||
      (selection && selection.node && selection.node.type.name === 'image') ||
      obj.from === obj.to
    )
      return false;
    setLinkPrompt(false);
    return true;
  };

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };
  const toggleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };
  const toggleHighlight = () => {
    editor.chain().focus().toggleHighlight().run();
  };
  const toggleBlockquote = () => {
    editor.chain().focus().toggleBlockquote().run();
  };
  const toggleCode = () => {
    editor.chain().focus().toggleCode().run();
  };
  const openLink = () => setLinkPrompt(true);
  const toText = () => {
    if (editor.isActive('heading', { level: 1 })) {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (editor.isActive('heading', { level: 2 })) {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (editor.isActive('bulletList')) {
      editor.chain().focus().toggleBulletList().run();
    } else if (editor.isActive('orderedList')) {
      editor.chain().focus().toggleOrderedList().run();
    } else if (editor.isActive('highlight')) {
      editor.chain().focus().toggleHighlight().run();
    }
  };

  const setLinkClick = () => {
    if (linkRef && linkRef.current && linkRef.current.value) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkRef.current.value }).run();
      setLinkPrompt(false);
    }
  };

  const deleteLinkClick = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkPrompt(false);
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{ duration: 100 }}
      className='flex rounded-lg shadow-lg border-1 border-gray-200 bg-white ml-16 w-85'
    >
      <Show when={!linkPrompt}>
        <BubbleButton onClick={toggleBold} name='bold' icon={<FontBoldIcon />} editor={editor} />
        <BubbleButton onClick={toggleItalic} name='italic' icon={<FontItalicIcon />} editor={editor} />
        <BubbleButton onClick={toText} name='text' icon={<TextIcon />} editor={editor} />
        <BubbleHeaderButton level={1} editor={editor} />
        <BubbleHeaderButton level={2} editor={editor} />
        <BubbleButton onClick={toggleHighlight} name='highlight' icon={highlightIcon(editor)} editor={editor} />
        <BubbleButton onClick={toggleBlockquote} name='blockquote' icon={<QuoteIcon />} editor={editor} />
        <BubbleButton onClick={toggleCode} name='code' icon={<CodeIcon />} editor={editor} />
        <BubbleButton onClick={openLink} name='link' icon={<Link2Icon />} editor={editor} />
      </Show>

      <Show when={linkPrompt}>
        <input
          className='flex flex-1 ml-1 mr-1'
          type='text'
          placeholder='Add a link'
          defaultValue={editor.getAttributes('link').href}
          ref={linkRef}
        />
        <BubbleButton onClick={setLinkClick} icon={<CheckIcon />} />
        <BubbleButton onClick={deleteLinkClick} icon={<Cross2Icon />} />
      </Show>
    </BubbleMenu>
  );
}

function BubbleButton(props) {
  return (
    <button
      onClick={props.onClick}
      className={
        props.editor && props.editor.isActive(props.name) ? 'bubble-menu-button-active' : 'bubble-menu-button-inactive'
      }
    >
      {props.icon}
    </button>
  );
}

function BubbleHeaderButton(props) {
  const isActive = props.editor.isActive('heading', { level: props.level });
  return (
    <button
      onClick={() => props.editor.chain().focus().toggleHeading({ level: props.level }).run()}
      className={isActive ? 'bubble-menu-button-active' : 'bubble-menu-button-inactive'}
    >
      <HeadingIcon />
      <span className={isActive ? 'header-icon-active' : 'header-icon-inactive'}>{props.level}</span>
    </button>
  );
}

const highlightIcon = editor => (
  <svg width='12' viewBox='0 0 82 85'>
    <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <g fill={!editor.isActive('highlight') ? '#4b5563' : 'white'} fillRule='nonzero'>
        <path d='M5.50,70.93 L11.01,70.93 C12.28,70.93 12.77,70.69 13.65,70.01 L16.14,68.05 C17.80,69.47 20.05,69.76 22.25,68.79 L34.79,63.41 C35.77,62.98 36.36,62.58 37.04,61.90 L74.10,24.89 C78.01,20.98 77.96,16.30 74.10,12.39 L65.60,3.89 C61.70,0.04 57.01,-0.00 53.10,3.84 L16.04,40.86 C15.36,41.54 14.97,42.13 14.53,43.10 L9.11,55.65 C8.13,57.80 8.38,60.05 9.79,61.71 L4.08,67.71 C2.81,69.03 3.40,70.93 5.50,70.93 Z M58.04,9.95 C58.87,9.12 59.79,9.07 60.58,9.85 L68.14,17.42 C68.92,18.20 68.88,19.13 68.05,19.96 L65.85,22.20 L55.79,12.15 L58.04,9.95 Z M24.00,43.88 L50.96,16.98 L60.97,27.04 L34.06,53.94 L24.00,43.88 Z M21.32,60.83 C20.63,61.12 20.15,61.12 19.51,60.49 L17.41,58.39 C16.78,57.80 16.83,57.26 17.07,56.63 L20.10,49.74 L28.20,57.85 L21.32,60.83 Z M4.62,84.70 L77.62,84.70 C79.76,84.70 81.52,82.90 81.52,80.80 C81.52,78.65 79.76,76.89 77.62,76.89 L4.62,76.89 C2.47,76.89 0.76,78.70 0.76,80.80 C0.76,82.90 2.52,84.70 4.62,84.70 Z' />
      </g>
    </g>
  </svg>
);
