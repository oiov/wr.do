"use client";

import { useState } from "react";
import { HanEvent } from "@prisma/client";
import useSWR, { useSWRConfig } from "swr";

import { cn, fetcher, timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardStack, Highlight } from "@/components/ui/card-stack";
import { Skeleton } from "@/components/ui/skeleton";
import Modal from "@/components/shared/modal";

import XihanLoading from "../loading";
import { EventForm, FormType } from "./event-form";
import { ExpandableCard } from "./expandable-event";

export default function EventList() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType>("add");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentEditEvent, setCurrentEditEvent] = useState<HanEvent | null>(
    null,
  );

  const { mutate } = useSWRConfig();

  const { data, error, isLoading } = useSWR<{
    total: number;
    records: HanEvent[];
    talks: HanEvent[];
  }>(`/api/xihan/event?page=${currentPage}&size=${pageSize}`, fetcher, {
    revalidateOnFocus: false,
  });

  const handleRefresh = () => {
    mutate(`/api/xihan/event?page=${currentPage}&size=${pageSize}`, undefined);
  };

  return (
    <div className="p-4">
      <ExpandableCard />

      {data?.talks ? (
        <CardStack
          onEdit={(id) => {
            setCurrentEditEvent(data?.talks.find((event) => event.id === id)!);
            setFormType("edit");
            setShowModal(true);
          }}
          items={data?.talks.map((talk, index) => ({
            id: talk.id,
            name: talk.name,
            anthor: talk.participants || "匿名",
            designation: timeAgo(talk.firstOccurredAt, false, true),
            content: (
              <p>
                <Highlight>{talk.notes || "默认留言"}</Highlight>
              </p>
            ),
          }))}
        />
      ) : (
        <Skeleton className="h-48 w-full rounded-lg" />
      )}

      {!showModal && (
        <Button
          variant="ipink"
          onClick={() => {
            setCurrentEditEvent(null);
            setFormType("add");
            setShowModal(true);
          }}
        >
          {formType === "add" ? "添加" : "编辑"}
        </Button>
      )}
      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          showBlur={false}
        >
          <div className="h-full overflow-y-scroll">
            <EventForm
              isShowForm={showModal}
              setShowForm={setShowModal}
              type={formType}
              initData={currentEditEvent}
              onRefresh={handleRefresh}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
