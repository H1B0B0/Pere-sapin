"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useState } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  LinkIcon,
  PhotoIcon,
  ListBulletIcon,
  NumberedListIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichEditor({
  content,
  onChange,
  placeholder,
}: RichEditorProps) {
  const {
    isOpen: isLinkOpen,
    onOpen: onLinkOpen,
    onOpenChange: onLinkOpenChange,
  } = useDisclosure();
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onOpenChange: onImageOpenChange,
  } = useDisclosure();
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl && linkText) {
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${linkUrl}">${linkText}</a>`)
        .run();
      setLinkUrl("");
      setLinkText("");
      onLinkOpenChange();
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
      setImageUrl("");
      setImageAlt("");
      onImageOpenChange();
    }
  };

  return (
    <div className="border border-default-200 rounded-lg">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 border-b border-default-200 bg-default-50">
        <Button
          size="sm"
          variant={editor.isActive("bold") ? "solid" : "flat"}
          isIconOnly
          onPress={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("italic") ? "solid" : "flat"}
          isIconOnly
          onPress={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("code") ? "solid" : "flat"}
          isIconOnly
          onPress={() => editor.chain().focus().toggleCode().run()}
        >
          <CodeBracketIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-default-200 mx-1" />

        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 1 }) ? "solid" : "flat"}
          onPress={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 2 }) ? "solid" : "flat"}
          onPress={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("heading", { level: 3 }) ? "solid" : "flat"}
          onPress={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </Button>

        <div className="w-px h-8 bg-default-200 mx-1" />

        <Button
          size="sm"
          variant={editor.isActive("bulletList") ? "solid" : "flat"}
          isIconOnly
          onPress={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListBulletIcon className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant={editor.isActive("orderedList") ? "solid" : "flat"}
          isIconOnly
          onPress={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <NumberedListIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-default-200 mx-1" />

        <Button size="sm" variant="flat" isIconOnly onPress={onLinkOpen}>
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button size="sm" variant="flat" isIconOnly onPress={onImageOpen}>
          <PhotoIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-default-200 mx-1" />

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: "left" }) ? "solid" : "flat"}
          onPress={() => editor.chain().focus().setTextAlign("left").run()}
        >
          ⬅️
        </Button>

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: "center" }) ? "solid" : "flat"}
          onPress={() => editor.chain().focus().setTextAlign("center").run()}
        >
          ↔️
        </Button>

        <Button
          size="sm"
          variant={editor.isActive({ textAlign: "right" }) ? "solid" : "flat"}
          onPress={() => editor.chain().focus().setTextAlign("right").run()}
        >
          ➡️
        </Button>
      </div>

      {/* Editor Content */}
      <div className="p-4 min-h-[200px]">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none"
          placeholder={placeholder}
        />
      </div>

      {/* Link Modal */}
      <Modal isOpen={isLinkOpen} onOpenChange={onLinkOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>Ajouter un lien</h3>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Texte du lien"
                    placeholder="Texte à afficher"
                    value={linkText}
                    onValueChange={setLinkText}
                  />
                  <Input
                    label="URL"
                    placeholder="https://exemple.com"
                    value={linkUrl}
                    onValueChange={setLinkUrl}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button color="primary" onPress={addLink}>
                  Ajouter
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Image Modal */}
      <Modal isOpen={isImageOpen} onOpenChange={onImageOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>Ajouter une image</h3>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="URL de l'image"
                    placeholder="https://exemple.com/image.jpg"
                    value={imageUrl}
                    onValueChange={setImageUrl}
                  />
                  <Input
                    label="Texte alternatif"
                    placeholder="Description de l'image"
                    value={imageAlt}
                    onValueChange={setImageAlt}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button color="primary" onPress={addImage}>
                  Ajouter
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
