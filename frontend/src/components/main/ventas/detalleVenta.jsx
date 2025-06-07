import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PanelDetalleVenta({ venta }) {
  const [numPages, setNumPages] = useState(null);

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  let rutaPDF = "";
  if (venta?.url_ticket) {
    rutaPDF = `${import.meta.env.VITE_IMG_HOST}${venta?.url_ticket}`;
  }

  return (
    <div className="h-full overflow-auto p-4">
      <Document file={rutaPDF} onLoadSuccess={handleLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
}
