// ResumeEditor.js
import React, { useState, useEffect } from 'react';
import { Editor, EditorState, ContentState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { getResumeDataAsHtml } from '../display/ResumeData';

const ResumeEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    const defaultContent = getResumeDataAsHtml();
    const contentState = ContentState.createFromText(defaultContent);
    return EditorState.createWithContent(contentState);
  });
  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const handleItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  const handleUnderlineClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const defaultContent = getResumeDataAsHtml();
        const contentState = ContentState.createFromText(defaultContent);
        setEditorState(EditorState.createWithContent(contentState));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Edit Your Resume</h2>
      <div>
        <button onClick={handleBoldClick}>Bold</button>
        <button onClick={handleItalicClick}>Italic</button>
        <button onClick={handleUnderlineClick}>Underline</button>
      </div>
      <Editor
        editorState={editorState}
        onChange={handleEditorChange}
      />

      <div>
        <h2>Preview:</h2>
        <div dangerouslySetInnerHTML={{ __html: editorState.getCurrentContent().getPlainText() }} />
      </div>
    </div>
  );
};

export default ResumeEditor;
