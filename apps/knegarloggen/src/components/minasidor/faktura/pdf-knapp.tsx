"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FakturaPdf } from "./faktura-pdf";
import type { FakturaData } from "./faktura-data";

interface Props {
  data: FakturaData;
}

export function PdfKnapp({ data }: Props) {
  return (
    <PDFDownloadLink
      document={<FakturaPdf data={data} />}
      fileName={`faktura-${data.ocr}.pdf`}
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
