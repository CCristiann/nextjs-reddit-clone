import React from "react";
import { Source_Code_Pro } from "next/font/google";
import { Editor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
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
