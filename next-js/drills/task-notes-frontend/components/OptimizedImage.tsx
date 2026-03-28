// components/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    priority?: boolean;
    sizes?: string;
    className?: string; // Allow extending classes
}

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    priority = false,
    sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    className = "",
}: OptimizedImageProps) {
    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            sizes={sizes}
            // A simple 1x1 transparent png pixel for a generic fast blur placeholder. In a real app we'd use something generated per image.
            placeholder="blur"
            blurDataURL="data:image/png;base64,..."
            className={`rounded-lg object-cover ${className}`}
        />
    );
}