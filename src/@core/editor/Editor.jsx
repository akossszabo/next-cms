import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import EditorBubble from './EditorBubble';
import Image from '@tiptap/extension-image';
import EditorFloatingMenu from './EditorFloatingMenu';
import EditorImageBubble from './EditorImageBubble';
import { blogService } from '../services/BlogService';
import axios from 'axios';

export default function Editor(props) {
  const editor = useEditor({
    extensions: [
      Image,
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }
      }),
      Placeholder.configure({
        placeholder: 'Tell your story…'
      }),
      Link.configure({
        openOnClick: false
      }),
      Highlight
    ],
    content: props.article.content,
    autofocus: true,
    onSelectionUpdate({ editor }) {},
    onUpdate: ({ editor }) => {
      handleChange('editor');
    }
  });

  const saved = useRef(null);
  const title = useRef(null);
  const subtitle = useRef(null);
  const timeoutId = useRef(null);

  const imagePropertiesModal = useRef(null);

  const [altText, setAltText] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [showImageBubbleMenu, setShowImageBubbleMenu] = useState(false);

  const showImagePropertiesModal = () => {
    imagePropertiesModal.current.click();
  };

  async function saveStory() {
    if (title.current && title.current.trim() !== '') {
      let trimmedTitle = title.current.trim();
      const isEditor = editor;
      if (saved.current) {
        if (trimmedTitle !== props.article.title || isEditor) {
          const content = isEditor ? editor.current.getJSON() : null;
          await blogService.updateStory(props.openedStoryId, {
            title: trimmedTitle,
            content: content
          });
        }
      } else {
        const content = isEditor ? editor.getJSON() : null;
        const id = await blogService.createStory(trimmedTitle, content);
        if (id) saved.current = id;
      }
    }
  }

  const handleChange = e => {
    if (e && e === 'editor') {
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => saveStory(), 10000);
    } else if (e && e.target && e.target.id) {
      clearTimeout(timeoutId.current);
      const newValue = e.target.value;
      if (e.target.id == 'title' && title.current !== newValue) {
        title.current = newValue;
        timeoutId.current = setTimeout(() => saveStory(), 5000);
      } else if (e.target.id == 'subtitle' && subtitle.current !== newValue) {
        subtitle.current = newValue;
        timeoutId.current = setTimeout(() => saveStory(), 5000);
      }
    }
  };

  const handleFileChange = async e => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData
    });
    const body = await response.json();
    editor.commands.setImage({
      src: body.url
    });
  };

  const saveProperties = () => {
    const imageNode = getImageNode();
    if (imageNode) {
      imageNode.attrs.alt = altText;
      imageNode.attrs.title = imageCaption;
    }
  };

  const initProperties = () => {
    const imageNode = getImageNode();
    if (imageNode) {
      setAltText(imageNode.attrs.alt);
      setImageCaption(imageNode.attrs.title);
    }
  };

  const getImageNode = () => {
    const sel = editor.view.state.selection;
    if (sel && sel.node && sel.node.type.name === 'image') {
      return sel.node;
    }
    return null;
  };

  return (
    <div className='w-full min-h-fit flex justify-center'>
      {editor && (
        <div className='flex flex-col w-11/12 border-gray-400 border-solid border-2 h-auto min-h-fit my-8 rounded'>
          <EditorBubble editor={editor} />
          <EditorImageBubble editor={editor} openModal={showImagePropertiesModal} />
          <EditorFloatingMenu editor={editor} onFileChange={handleFileChange} />
          <EditorContent
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            editor={editor}
            className='self-center bg-white py-4 w-11/12'
          />
        </div>
      )}
    </div>
  );
}
