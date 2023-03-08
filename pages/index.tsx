// import { useState, useEffect } from "react";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import "tailwindcss/tailwind.css";
// import { extractColors } from "extract-colors";

interface Prediction {
  id: string;
  status: string;
  output?: string[];
  detail?: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>("#4D6378");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.currentTarget.prompt.value,
      }),
    });
    let prediction = (await response.json()) as Prediction;
    if (response.status !== 201) {
      setError(prediction.detail ?? null);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = (await response.json()) as Prediction;
      if (response.status !== 200) {
        setError(prediction.detail ?? null);
        return;
      }
      setPrediction(prediction);
    }
  };
//   useEffect(() => {
//     document.body.style.backgroundColor = bgColor;
//   }, [bgColor]);

// useEffect(() => {
//   const updateBgColor = async () => {
//     console.log("updateBgColor function called");
//     try {
//       if (prediction?.output && prediction.output.length > 0) {
//         const lastImage = prediction.output[prediction.output.length - 1];
//         const img = new Image();
//         img.src = lastImage;
//         img.crossOrigin = "anonymous";
//         img.onload = async () => {
//           console.log("Image loaded");
//           const colors = await extractColors(img, { format: "hex" });
//           console.log("Colors:", colors);
//           if (colors.length > 0) {
//             const [{ hex: hexColor }] = colors;
//             console.log("Setting background color to:", hexColor);
//             setBgColor(hexColor);
//           }
//         };
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   updateBgColor();
// }, [prediction]);

  return (
    // <div style={{ backgroundColor: bgColor }} className="min-h-screen">
          <div className="bg-blue-900 text-blue-500 min-h-screen">

      <div className="container mx-auto max-w-3xl py-4 pt-12 px-8">
        <Head>
          <title>Augmented Imagination by Help, I'm fine.</title>
        </Head>
        <div className="flex items-center justify-center flex-wrap"> <p className="text-s text-blue-600 font-medium mr-2 pb-4">Augmented Imagination</p></div>
        <div className="flex items-center justify-center flex-wrap">
         
          <Image
            src="/logo.svg"
            alt="Help, I'm fine. Logo"
            width={168}
            height={48}
            priority
          />
        </div>        
        <form className="flex flex-col items-center mt-8" onSubmit={handleSubmit}>
          <div className="w-full flex items-center mb-4">
            <input
              className="w-full bg-blue-800 px-3 py-2 text-base placeholder-blue-500 text-blue-300 rounded-md focus:outline-none focus:shadow-outline"
              type="text"
              name="prompt"
              placeholder="What magic can you manifest?"
            />
            <button className="bg-blue-800  text-white font-bold py-2 px-4 ml-3 rounded hover:scale-110 transition-all" type="submit">
              🪄
            </button>
          </div>
        </form>

        <div className="mt-8">
          {error && <div className="text-yellow-500">{error}</div>}

          {prediction && (
            <div>
              {prediction.output && (
                <div className="w-full">
                  <img
                    src={prediction.output[prediction.output.length - 1]}
                    alt="output"
                    sizes="100vw"
                  />
                </div>
              )}

              <div className="flex flex-col items-center  mt-8">
                <p>Status: {prediction.status}</p>
                {prediction.status === "succeeded" && (
                  <p>
                    Your wish is our command. (
                    <a
                      className="text-yellow-500 hover:text-yellow-400 transition-all"
                      href={`/api/predictions/${prediction.id}`}
                      target="_blank"
                    >
                      Download image 
                    </a>
                    )
                  </p>
                )}

<p className="pt-4 text-sm">You are using an AI image generator by Help, I'm fine. that is powered by a generic Stable Diffusion model. We plan on swapping the model for a custom trained model once we are ready.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    
  );
}