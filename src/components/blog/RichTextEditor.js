// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// const RichTextEditor = ({ placeholder, onChange, html }) => {
//   return (
//     <ReactQuill
//       theme={'snow'}
//       onChange={onChange}
//       value={html}
//       modules={RichTextEditor.modules}
//       formats={RichTextEditor.formats}
//       bounds={'.app'}
//       placeholder={placeholder}
//     />
//   );
// };

// RichTextEditor.modules = {
//   toolbar: [
//     [{ header: '1' }, { header: '2' }, { font: [] }],
//     [{ size: [] }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [
//       { list: 'ordered' },
//       { list: 'bullet' },
//       { indent: '-1' },
//       { indent: '+1' },
//     ],
//     ['link', 'image', 'video'],
//     ['clean'],
//   ],
//   clipboard: {
//     // toggle to add extra line breaks when pasting HTML:
//     matchVisual: false,
//   },
//   // image: {
//   //   urlEnabled: true,
//   //   toolbar: ['align', 'width', 'height', 'link', 'alt', 'caption'],
//   // },
// };

// RichTextEditor.formats = [
//   'header',
//   'font',
//   'size',
//   'bold',
//   'italic',
//   'underline',
//   'strike',
//   'blockquote',
//   'list',
//   'bullet',
//   'indent',
//   'link',
//   'image',
//   'video',
// ];

// export default RichTextEditor;

import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

const RichTextEditor = ({ placeholder, onChange, html }) => {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  // const config = useMemo(
  //   {
  //     readonly: false, // all options from https://xdsoft.net/jodit/docs/,
  //     placeholder: placeholder || 'Start typings...',
  //   },
  //   [placeholder],
  // );

  return (
    <JoditEditor
      ref={editor}
      value={html}
      // config={config}
      tabIndex={1} // tabIndex of textarea
      // onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
      onChange={onChange}
    />
  );
};

export default RichTextEditor;
