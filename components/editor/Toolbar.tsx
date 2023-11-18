"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading,
  Code,
  Image,
  Link,
} from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { Toggle } from "@/components/ui/Toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";
import { buttonVariants } from "../ui/Button";
import toast from "react-hot-toast";
import { uploadFiles } from "@/libs/upload";
import { Input } from "../ui/Input";
import { Label } from "../ui/label";
import { LinkValidator } from "@/libs/validators/link";
import { ZodError } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/Alert-dialog";

type ToolbarProps = {
  editor: Editor | null;
  image?: boolean;
};

const Toolbar: React.FC<ToolbarProps> = ({ editor, image }) => {
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [linkText, setLinkText] = useState<string>("");

  if (!editor) return null;

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploadImage = async () => {
      try {
        const [res] = await uploadFiles({
          endpoint: "imageUploader",
          files: [files[0]],
        });

        if (res) {
          editor.chain().focus().setImage({ src: res.url }).run();
          return res.url;
        }
      } catch (err: any) {
        return null;
      }
    };

    const image = uploadImage();
    toast.promise(image, {
      success: "Image uploaded successfully",
      error: "An error occurred while trying upload image",
      loading: "Uploading image",
    });
  };

  const addLink = () => {
    try {
      LinkValidator.parse({ linkText, linkUrl });

      if (linkUrl === null) {
        return;
      }

      if (linkUrl === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    } catch (err) {
      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);
      }
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex rounded-t-md border border-input bg-zinc-50 p-1 text-xs dark:bg-zinc-900">
      <TooltipProvider delayDuration={400}>
        {/* BOLD */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold
                size={18}
                className={`
                transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800
                ${
                  editor.isActive("bold")
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-neutral-500"
                }
              `}
              />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold</p>
          </TooltipContent>
        </Tooltip>
        {/* ITALIC */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("italic")}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
            >
              <Italic
                size={18}
                className={`
                transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800
                ${
                  editor.isActive("italic")
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-neutral-500"
                }
              `}
              />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italics</p>
          </TooltipContent>
        </Tooltip>
        {/* LINK */}
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Toggle
                  size={"sm"}
                  pressed={editor.isActive("link")}
                  onPressedChange={() => {}}
                >
                  <Link
                    size={18}
                    className={`
                transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800
                ${
                  editor.isActive("link")
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-neutral-500"
                }
              `}
                  />
                </Toggle>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add a link to your text</AlertDialogTitle>
                </AlertDialogHeader>
                <div>
                  <Label htmlFor="linkUrl" className="hidden" />
                  <Input
                    onChange={(e) => setLinkUrl(e.target.value)}
                    id="linkUrl"
                    placeholder="Paste or type a link"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={addLink}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TooltipTrigger>
          <TooltipContent>
            <p>Link</p>
          </TooltipContent>
        </Tooltip>
        {/* STRIKETHROUGH */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("strike")}
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
            >
              <Strikethrough
                size={18}
                className={`
              transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800
              ${
                editor.isActive("strike")
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-neutral-500"
              }
            `}
              />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Strikethrough</p>
          </TooltipContent>
        </Tooltip>
        {/* HEADING */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("heading")}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <Heading
                size={18}
                className={`
              transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800
              ${
                editor.isActive("heading")
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-neutral-500"
              }
            `}
              />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading</p>
          </TooltipContent>
        </Tooltip>
        {/* BULLET LIST */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("bulletList")}
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
            >
              <List
                size={18}
                className={`
              transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800
              ${
                editor.isActive("bulletList")
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-neutral-500"
              }
            `}
              />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bulleted List</p>
          </TooltipContent>
        </Tooltip>
        {/* ORDERED LIST */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("orderedList")}
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
            >
              <ListOrdered
                size={18}
                className={`
              transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800
              ${
                editor.isActive("orderedList")
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-neutral-500"
              }
            `}
              />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Numbered List</p>
          </TooltipContent>
        </Tooltip>
        {/* CODE BLOCK */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size={"sm"}
              pressed={editor.isActive("codeBlock")}
              onPressedChange={() =>
                editor.chain().focus().toggleCodeBlock().run()
              }
            >
              <Code
                size={18}
                className={`
              transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800
              ${
                editor.isActive("codeBlock")
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-neutral-500"
              }
            `}
              />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Code Block</p>
          </TooltipContent>
        </Tooltip>
        {/* IMAGE */}
        {image && (
          <Tooltip>
            <TooltipTrigger
              className={`
          ${buttonVariants({ variant: "ghost" })}
          rounded-md
          `}
              asChild
            >
              <div className="relative">
                <input
                  onChange={handleImageUpload}
                  type="file"
                  accept="image/png, image/jpg, image/jpeg, image/webp"
                  className="absolute h-full w-full opacity-0"
                />
                <Image
                  size={18}
                  className={`
              transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800
              ${
                editor.isActive("image")
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-neutral-500"
              }
            `}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Image</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default Toolbar;
