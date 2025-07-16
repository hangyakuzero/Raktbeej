import React from "react";

function HOME() {
  return (
    <div className="text-slate-200 font-semibold justify-center items-center">

      <div
        className="text-center"
        style={{
          backgroundImage:
            "radial-gradient(circle at 0.5px 0.5px, rgba(255,255,255,0.1) 1px, transparent 0)",
          backgroundSize: "8px 8px",
          backgroundRepeat: "repeat",
        }}
      >
        <h1 className="text-3xl font-bold pt-5">What Is This All About?</h1>
        <p></p>
        <h1 className="text-3xl font-bold pt-5">The Need</h1>
        <p></p>
        <h1 className="text-3xl font-bold pt-5">The Cool Tech Behind It</h1>
        <p></p>
        <h1 className="text-3xl font-bold pt-5">Further Enhancements?</h1>
        <p></p>
      </div>
    </div>
  );
}

export default HOME;
