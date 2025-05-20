"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

export default function PDFViewer({ fileUrl }: { fileUrl: string }) {
  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div className="w-full bg-white rounded-md shadow">
        <div className="flex gap-4 p-2 border-b bg-gray-100">
          <ZoomOutButton />
          <ZoomPopover />
          <ZoomInButton />
        </div>
        <div className="h-[600px]">
          <Viewer fileUrl={fileUrl} plugins={[zoomPluginInstance]} />
        </div>
      </div>
    </Worker>
  );
}
