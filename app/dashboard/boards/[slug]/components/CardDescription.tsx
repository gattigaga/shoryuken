"use client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdViewHeadline, MdClose } from "react-icons/md";
import Markdown from "react-markdown";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  linkDialogPlugin,
  BoldItalicUnderlineToggles,
  CreateLink,
  linkPlugin,
  BlockTypeSelect,
  Separator,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import useCardQuery from "../hooks/use-card-query";
import useUpdateCardMutation from "../hooks/use-update-card-mutation";
import Button from "../../../../components/Button";
import ListsToggle from "./ListsToggle";

type Props = {
  id: number;
};

const CardDescription: React.FC<Props> = ({ id }) => {
  const cardQuery = useCardQuery(id);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const refInput = useRef<MDXEditorMethods>(null);
  const { _ } = useLingui();
  const updateCardMutation = useUpdateCardMutation();

  const applyDescription = async () => {
    if (!cardQuery.data) return;

    setIsEditing(false);

    try {
      await updateCardMutation.mutateAsync({
        id,
        listId: cardQuery.data.list_id,
        body: {
          description,
        },
      });
    } catch (error) {
      toast.error(_(msg`Failed to update a card description.`));
    }
  };

  useEffect(() => {
    if (cardQuery.data) {
      setDescription(cardQuery.data.description || "");
    }
  }, [cardQuery.data]);

  return (
    <div className="flex flex-1">
      <span className="text-slate-700 mr-3 mt-[0.1rem]">
        <MdViewHeadline size={24} />
      </span>
      <div className="w-full">
        <h2 className="text-lg text-slate-700 font-semibold mb-4">
          <Trans>Description</Trans>
        </h2>

        <div className="-ml-8 w-full md:ml-0">
          {!isEditing && (
            <>
              {cardQuery.data?.description ? (
                <button
                  className="w-full text-left"
                  type="button"
                  onClick={() => {
                    setIsEditing(true);

                    setTimeout(() => {
                      refInput.current?.focus();
                    }, 100);
                  }}
                >
                  <Markdown className="prose prose-sm prose-slate">
                    {cardQuery.data.description}
                  </Markdown>
                </button>
              ) : (
                <button
                  className="w-full text-left flex text-slate-700 text-xs h-16 bg-slate-300 rounded p-3 hover:bg-slate-400"
                  type="button"
                  onClick={() => {
                    setIsEditing(true);

                    setTimeout(() => {
                      refInput.current?.focus();
                    }, 100);
                  }}
                >
                  <p>
                    <Trans>Add a more detailed description...</Trans>
                  </p>
                </button>
              )}
            </>
          )}
          {isEditing && (
            <>
              <MDXEditor
                ref={refInput}
                className="mb-4 min-w-full max-w-full"
                contentEditableClassName="prose prose-sm prose-slate bg-white min-h-40 max-w-full rounded-b"
                placeholder={_(msg`Add a more detailed description...`)}
                plugins={[
                  headingsPlugin(),
                  listsPlugin(),
                  quotePlugin(),
                  markdownShortcutPlugin(),
                  linkDialogPlugin(),
                  linkPlugin(),
                  toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        <BlockTypeSelect />
                        <BoldItalicUnderlineToggles />
                        <Separator />
                        <CreateLink />
                        <Separator />
                        <ListsToggle />
                      </>
                    ),
                  }),
                ]}
                markdown={description}
                onChange={setDescription}
              />
              <div className="flex items-center">
                <Button
                  className="outline-black mr-2"
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    applyDescription();
                  }}
                >
                  <Trans>Save</Trans>
                </Button>
                <button
                  className="text-slate-500 hover:text-slate-600"
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setDescription(cardQuery.data?.description || "");
                  }}
                >
                  <MdClose size={24} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDescription;
