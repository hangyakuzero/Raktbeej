"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const signedUrl = await uploadRequest.json();
      setUrl(signedUrl);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
  };

  return (
    <div className="bg-base-100 text-2xl text-slate-50">
    <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
      <input type="file" className="file-input file-input-accent" onChange={handleChange} />
      <br/>
      <button type="button" className="btn btn-info" disabled={uploading} onClick={uploadFile} >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {url && <object data={url} type="application/pdf" height="350px" width="500px"/>}
    </main>
    </div>
  );
}