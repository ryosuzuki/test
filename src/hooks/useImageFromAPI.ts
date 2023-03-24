import { useState, useEffect } from "react";

export default function useImageFromAPI(url: string): HTMLImageElement | undefined {
    const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);

    useEffect(() => {
        fetch(url)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(data => {
                const imageSrc = data.contents;

                const img = new Image();
                img.src = imageSrc;
                img.onload = () => {
                    setImage(img);
                };
            });
    }, [url]);

    return image
}
