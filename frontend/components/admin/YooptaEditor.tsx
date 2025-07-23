"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import YooptaEditor, { createYooptaEditor } from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import { BulletedList, NumberedList } from "@yoopta/lists";
import Code from "@yoopta/code";
import ActionMenuList, {
  DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import LinkTool from "@yoopta/link-tool";
import Image from "@yoopta/image";
import PluginElementRenderProps from "@yoopta/image";
import NextImage from "next/image";

const plugins = [
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  BulletedList,
  NumberedList,
  Code,
  Image.extend({
    renders: {
      image: (props: PluginElementRenderProps) => {
        const { children, element, attributes } = props;

        return (
          // [NOTE] passing attributes is required
          <div {...attributes}>
            <NextImage
              src={element.props.src}
              alt={element.props.alt}
              width={element.props.sizes.width}
              height={element.props.sizes.height}
            />
            {/* [NOTE] passing children is required */}
            {children}
          </div>
        );
      },
    },
  }),
];

const tools = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: LinkTool,
  },
};

interface YooptaEditorWrapperProps {
  value?: string;
  onChange?: (markdown: string) => void;
  className?: string;
  placeholder?: string;
}

function YooptaEditorWrapper({
  value: initialValue,
  className = "",
  placeholder = "Commencez à écrire...",
}: YooptaEditorWrapperProps) {
  const editor = useMemo(() => createYooptaEditor(), []);
  const [value, setValue] = useState<YooptaEditor.YooptaContentValue>();

  const onChange = (
    value: YooptaEditor.YooptaContentValue,
    options: YooptaEditor.YooptaOnChangeOptions
  ) => {
    setValue(value);
  };

  return (
    <YooptaEditor
      editor={editor}
      plugins={plugins}
      tools={tools}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

export default YooptaEditorWrapper;