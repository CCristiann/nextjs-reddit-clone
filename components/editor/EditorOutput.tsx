import React from "react";
import { Source_Code_Pro } from "next/font/google";
import { Editor, EditorContent } from "@tiptap/react";
import { editorOptions } from "@/libs/tiptap";

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

type EditorOutputProps = {
  content: JSON;
};

const EditorOutput: React.FC<EditorOutputProps> = ({ content }) => {
  const editor = new Editor({
    editable: false,
    content: content,
    extensions: editorOptions.extensions,
  });

  return <EditorContent editor={editor} />;
};

export default EditorOutput;
