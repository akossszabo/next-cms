import { BubbleMenu } from '@tiptap/react';
import { GearIcon } from '@radix-ui/react-icons';
/* import Show from '../../core/Show' */

export default function EditorImageBubble(props) {
  const editor = props.editor;

  const shouldShow = (obj) => {
    const selection = obj.view.state.selection;
    return obj.view.hasFocus() && selection && selection.node && selection.node.type.name === 'image';
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{ duration: 100 }}
      className="flex rounded-lg shadow-lg border-1 border-warm-gray-200/70 bg-white ml-16"
    >
      <BubbleButton onClick={props.openModal} name="bold" title="settings" icon={<GearIcon />} editor={editor} />
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
