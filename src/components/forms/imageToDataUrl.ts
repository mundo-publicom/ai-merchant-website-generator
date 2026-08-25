const MAX_DIMENSION = 640;

/**
 * Reads an image file into a data URL, downscaled so browser storage can hold it.
 * Non-image files and failures resolve to null.
 */
export async function imageToDataUrl(file: File): Promise<string | null> {
  if (!file.type.startsWith("image/")) return null;

  const dataUrl = await new Promise<string | null>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
  if (!dataUrl) return null;
  if (file.type === "image/svg+xml") return dataUrl;

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
      if (scale === 1 && dataUrl.length < 200_000) {
        resolve(dataUrl);
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      if (!context) {
        resolve(dataUrl);
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/webp", 0.82));
    };
    image.onerror = () => resolve(null);
    image.src = dataUrl;
  });
}
