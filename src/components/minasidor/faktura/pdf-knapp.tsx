"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FakturaPdf, type PdfCompany } from "./faktura-pdf";
import type { Job } from "@/lib/job-schema";

interface Props {
  job: Job;
  company: PdfCompany;
  fakturanummer: number;
}

export function PdfKnapp({ job, company, fakturanummer }: Props) {
  return (
    <PDFDownloadLink
      document={
        <FakturaPdf job={job} company={company} fakturanummer={fakturanummer} />
      }
      fileName={`faktura-${fakturanummer}.pdf`}
    >
      {({ loading }) => (
        <Button variant="outline" size="sm" disabled={loading} asChild={false}>
          <Download className="h-4 w-4 mr-2" />
          {loading ? "Skapar PDF..." : "Ladda ner PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
