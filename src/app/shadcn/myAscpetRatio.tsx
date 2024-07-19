import Image from 'next/image';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

function MyAspectRatio() {
  return (
    <div className="w-[500px]">
      <AspectRatio ratio={16 / 9}>
        <Image
          src="https://media-assets.wired.it/photos/65250e824bcd5558b1bf6903/16:9/w_2580,c_limit/nascondere%20immagini%20testo%20foto%20ai.png" // Assicurati di fornire il percorso corretto dell'immagine
          alt="Image"
          fill 
          className="rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  );
}

export default MyAspectRatio;
