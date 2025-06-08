import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { RxCross2 } from "react-icons/rx";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PanelDetalleVenta({ venta }) {
  const [numPages, setNumPages] = useState(null);
  const [rutaPDF, setRutaPdf] = useState(null);

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // let rutaPDF = "";
  useEffect(() => {
    if (venta?.url_ticket) {
      setRutaPdf(`${import.meta.env.VITE_IMG_HOST}${venta.url_ticket}`);
    } else {
      setRutaPdf(null);
      setNumPages(null);
    }
  }, [venta]);

  return (
    <div>
      {numPages ? <div className="visorPDF-back"></div> : null}
      <div className={`h-full overflow-auto p-4 ${numPages ? "visorPDF" : ""}`}>
        <div className="flex justify-center items-start">
          <Document file={rutaPDF} onLoadSuccess={handleLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
          <button
            onClick={() => {
              setNumPages(null);
              setRutaPdf(null);
            }}
            className="visorPDF-close-btn"
          >
            <RxCross2 />
          </button>
        </div>
      </div>
    </div>
  );
}
