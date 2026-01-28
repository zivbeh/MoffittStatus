"use server";

export async function detectPeople(imageBlob: FormData) {
  const file = imageBlob.get("file") as File;
  const imageUrl = imageBlob.get("imageUrl") as string;

  // 1. Prepare the image data for the API
  let body: any;
  let contentType: string;

  if (file) {
    // If it's a file, we send the raw buffer
    const bytes = await file.arrayBuffer();
    body = Buffer.from(bytes);
    contentType = file.type;
  } else if (imageUrl) {
    // If it's a URL, we might need to fetch it first or send a JSON payload 
    // depending on the specific model endpoint. 
    // For stability, it's often safer to fetch the image server-side first:
    try {
        const fetchRes = await fetch(imageUrl);
        const arrayBuffer = await fetchRes.arrayBuffer();
        body = Buffer.from(arrayBuffer);
        contentType = fetchRes.headers.get("content-type") || "application/octet-stream";
    } catch (e) {
        throw new Error("Failed to download image from URL");
    }
  } else {
    throw new Error("No image provided");
  }

  // 2. Call Hugging Face API (DETR ResNet-50 model)
  // This model is excellent for object detection
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
        "Content-Type": contentType,
      },
      method: "POST",
      body: body,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    // Hugging Face sometimes returns "Model is loading" error. 
    // Ideally, you'd retry after a few seconds, but for now we throw.
    throw new Error(`AI Provider Error: ${errorText}`);
  }

  const result = await response.json();

  // 3. Filter for 'person' (DETR returns many objects)
  // result format is Array<{ score: number, label: string, box: {...} }>
  const people = result.filter(
    (item: any) => item.label === "person" && item.score > 0.9
  );

  return { 
    person_count: people.length,
    raw_data: people 
  };
}