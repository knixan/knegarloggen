// dialogen som visar detaljerad information om ett jobb, inklusive kontaktuppgifter, snabböversikt, arbetsbeskrivning, material och bilder, samt möjligheten att skriva ut översikten
"use client";

import { Printer, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { beräknaSummering, type Job } from "@/lib/job-schema";

import { Badge, StatusBadge } from "./job-overview-badges";
import { printJob } from "../faktura/print-job";
import { JobOverviewImages } from "./job-overview-images";
import {
  ContactSection,
  QuickOverviewSection,
  WorkDescriptionSection,
  MaterialSection,
  NotesSection,
} from "./job-overview-sections";

interface JobOverviewDialogProps {
  job: Job | null;
  onOpenChange: (open: boolean) => void;
  onSelectImage: (url: string) => void;
}

export default function JobOverviewDialog({
  job,
  onOpenChange,
  onSelectImage,
}: JobOverviewDialogProps) {
  if (!job) return null;
  const summary = beräknaSummering(job);

  return (
    <Dialog open={!!job} onOpenChange={onOpenChange}>
      <DialogContent className="job-overview-print flex h-[calc(100dvh-2rem)] max-h-[calc(100dvh-2rem)] w-[calc(100vw-1rem)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:h-auto sm:max-h-[90vh] sm:w-full">
        <DialogHeader className="shrink-0 p-4 pb-2 sm:p-6 sm:pb-2">
          <div className="flex items-start gap-3 pr-8">
            <DialogTitle className="flex min-w-0 flex-1 items-center gap-2 text-lg sm:text-xl">
              <User className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="truncate">
                {job.customer?.foretagsnamn?.trim() ||
                  job.customer?.namn?.trim() ||
                  "Jobböversikt"}
              </span>
            </DialogTitle>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="job-overview-print-hide shrink-0"
              onClick={() => printJob(job, summary)}
              aria-label="Skriv ut översikt"
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="min-h-0 flex-1 overflow-y-auto px-4 py-2 sm:px-6">
          <div className="job-overview-print-content space-y-4 pb-4">
            <div className="flex flex-wrap gap-2">
              <StatusBadge job={job} />
              {job.rotAvdrag && <Badge label="ROT" />}
              {job.fakturerat && <Badge label="Fakturerat" color="orange" />}
              {job.betalt && <Badge label="Betalt" color="green" />}
            </div>
            <Separator />
            <ContactSection job={job} />
            <Separator />
            <QuickOverviewSection job={job} summary={summary} />
            <WorkDescriptionSection job={job} />
            <MaterialSection job={job} />
            <JobOverviewImages job={job} onSelectImage={onSelectImage} />
            <NotesSection job={job} />
          </div>
        </ScrollArea>

        <div className="job-overview-print-hide shrink-0 border-t bg-muted/20 p-4 sm:p-6 sm:pt-3">
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Stäng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
