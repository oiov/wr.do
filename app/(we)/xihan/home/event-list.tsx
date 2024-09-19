"use client";

import { useState } from "react";
import { HanEvent } from "@prisma/client";
import useSWR, { useSWRConfig } from "swr";

import { fetcher } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/modal";

import { EventForm, FormType } from "./event-form";

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
    list: HanEvent[];
  }>(`/api/xihan/event?page=${currentPage}&size=${pageSize}`, fetcher, {
    revalidateOnFocus: false,
  });

  const handleRefresh = () => {
    mutate(`/api/xihan/event?page=${currentPage}&size=${pageSize}`, undefined);
  };

  return (
    <>
      {!showModal && (
        <Button onClick={() => setShowModal(true)}>
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
    </>
  );
}
