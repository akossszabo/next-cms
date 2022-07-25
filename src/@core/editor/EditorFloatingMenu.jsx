import { FloatingMenu } from '@tiptap/react';

import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltOutlined';

import { Camera, Add } from 'mdi-material-ui/light';

import { useState, useRef } from 'react';

export default function EditorFloatingMenu(props) {
  const editor = props.editor;
  const fileInput = useRef(null);
  const [menuClass, setMenuClass] = useState('');
  const [menuOpened, setMenuOpened] = useState(false);

  const uploadImage = event => {
    fileInput.current.click();
    toggleMenu();
  };

  const toggleMenu = event => {
    setMenuOpened(!menuOpened);
    if (!menuOpened) {
      setMenuClass('menu-opened');
    } else {
      setMenuClass('menu-closed');
    }
  };

  const insertSeparator = event => {
    editor.chain().focus().setHorizontalRule().createParagraphNear().run();
    toggleMenu();
  };

  return (
    <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className='z-50'>
      <div className='floating-menu-container'>
        <div className='floating-menu'>
          <button onClick={toggleMenu}>
            <AddCircleOutlineRoundedIcon className={`${menuClass} w-5 h-5`} />
          </button>
        </div>
        <div className={`${menuOpened ? 'visible' : 'invisible'} floating-sub-menu-container `}>
          <div className='floating-sub-menu'>
            <button onClick={uploadImage}>
              <CameraAltRoundedIcon />
            </button>
          </div>
          <div className='floating-sub-menu'>
            <button onClick={insertSeparator}>
              <MoreHorizRoundedIcon />
            </button>
          </div>
        </div>
      </div>
      <input type='file' id='file' onInput={props.onFileChange} ref={fileInput} style={{ display: 'none' }} />
    </FloatingMenu>
  );
}

// ${menuOpened ? 'visible' : 'invisible'}
