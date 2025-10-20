"use client";

import * as React from "react";

// --- UI Primitives ---
import { Button } from "@/components/shared/tiptap/tiptap-ui-primitive/button";
import { Spacer } from "@/components/shared/tiptap/tiptap-ui-primitive/spacer";
import {
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/shared/tiptap/tiptap-ui-primitive/toolbar";

import "@/components/shared/tiptap/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/shared/tiptap/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/shared/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/shared/tiptap/tiptap-node/list-node/list-node.scss";
import "@/components/shared/tiptap/tiptap-node/image-node/image-node.scss";
import "@/components/shared/tiptap/tiptap-node/heading-node/heading-node.scss";
import "@/components/shared/tiptap/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/shared/tiptap/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/shared/tiptap/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/shared/tiptap/tiptap-icons/link-icon";
// --- Components ---
import { BlockquoteButton } from "@/components/shared/tiptap/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/shared/tiptap/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent,
} from "@/components/shared/tiptap/tiptap-ui/color-highlight-popover";
// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/shared/tiptap/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/shared/tiptap/tiptap-ui/image-upload-button";
import {
  LinkButton,
  LinkContent,
  LinkPopover,
} from "@/components/shared/tiptap/tiptap-ui/link-popover";
import { ListDropdownMenu } from "@/components/shared/tiptap/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "@/components/shared/tiptap/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/shared/tiptap/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/shared/tiptap/tiptap-ui/undo-redo-button";

// --- Styles ---
import "@/components/shared/tiptap/tiptap-templates/simple/simple-editor.scss";

export const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      {/* <Spacer /> */}

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* <Spacer /> */}

      {/* {isMobile && <ToolbarSeparator />} */}

      {/* <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup> */}
    </>
  );
};

export const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);
