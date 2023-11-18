import StarterKit from "@tiptap/starter-kit";
import { Heading } from "@tiptap/extension-heading";
import { Placeholder } from "@tiptap/extension-placeholder";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Source_Code_Pro } from "next/font/google";

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const editorOptions = {
  extensions: [
    StarterKit.configure({}),
    Heading.configure({
      HTMLAttributes: {
        class: "editor_heading",
        levels: [1],
      },
    }),
    OrderedList.configure({
      HTMLAttributes: {
        class: "editor_ordered-list",
      },
    }),
    BulletList.configure({
      HTMLAttributes: {
        class: "editor_bullet-list",
      },
    }),
    CodeBlock.configure({
      HTMLAttributes: {
        class: `${sourceCodePro.className} editor_code-block`,
      },
    }),
    Image.configure({
      inline: false,
      HTMLAttributes: {
        class: "editor_image",
      },
    }),
    Link.configure({
      HTMLAttributes: {
        class: "editor_link",
      },
      autolink: false,
      linkOnPaste: false,
    }),
  ],
  editorProps: {
    attributes: {
      class: "editor",
    },
  },
};
