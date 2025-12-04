'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './author-slider.module.css';

const authors = [
    {
        name: "Alex Carter",
        role: "Fitness Expert",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        bio: "With over a decade of experience in the fitness industry, Alex specializes in strength training and functional fitness. Certified by NASM and known for his motivational style, Alex designs workout programs that are both challenging and achievable."
    },
    {
        name: "Sarah Jenkins",
        role: "Travel Writer",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        bio: "Sarah has visited over 50 countries, documenting her journey through vibrant photography and immersive storytelling. She believes in sustainable travel and finding the hidden gems that aren't in the guidebooks."
    },
    {
        name: "Marcus Chen",
        role: "Culinary Guide",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        bio: "A chef turned food critic, Marcus explores the world one bite at a time. From street food stalls in Bangkok to Michelin-starred restaurants in Paris, he brings the flavors of the world to your screen."
    },
    {
        name: "Elena Rodriguez",
        role: "Wellness Coach",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
        bio: "Elena combines modern psychology with ancient mindfulness practices. Her workshops and articles help people find balance in a chaotic world, focusing on mental clarity and emotional resilience."
    },
    {
        name: "David Smith",
        role: "Adventure Photographer",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        bio: "David's passion is capturing the raw beauty of nature. Whether he's scaling a mountain or diving into the deep blue, his lens reveals the breathtaking landscapes that remind us of the planet's wonder."
    }
];

export const AuthorSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % authors.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + authors.length) % authors.length);
    };

    useEffect(() => {
        if (!isPaused) {
            timeoutRef.current = setInterval(nextSlide, 5000);
        }
        return () => {
            if (timeoutRef.current) clearInterval(timeoutRef.current);
        };
    }, [isPaused]);

    const currentAuthor = authors[currentIndex];

    return (
        <section
            className={styles.slider}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label="Featured Authors"
        >
            <h3 className={styles.title}>About {currentAuthor.name}</h3>
            <p className={styles.role}>{currentAuthor.role}</p>

            <div className={styles.container}>
                {/* Previous Button */}
                <button
                    onClick={prevSlide}
                    className={`${styles['nav-btn']} ${styles['nav-btn--prev']}`}
                    aria-label="Previous Author"
                >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* Content */}
                <div
                    className={`${styles.content} ${styles['content-anim']}`}
                    key={currentIndex}
                    aria-live="polite"
                >
                    <div className={styles['avatar-wrapper']}>
                        <Image src={currentAuthor.avatar} alt={currentAuthor.name} fill className="object-cover" />
                    </div>
                    <p className={styles.bio}>
                        {currentAuthor.bio}
                    </p>
                </div>

                {/* Next Button */}
                <button
                    onClick={nextSlide}
                    className={`${styles['nav-btn']} ${styles['nav-btn--next']}`}
                    aria-label="Next Author"
                >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
            </div>

            {/* Dots Indicator */}
            <div className={styles.dots} role="tablist" aria-label="Author slides">
                {authors.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`${styles.dot} ${idx === currentIndex ? styles['dot--active'] : ''}`}
                        aria-label={`Go to author ${authors[idx].name}`}
                        role="tab"
                        aria-selected={idx === currentIndex}
                        aria-controls={`author-slide-${idx}`}
                    />
                ))}
            </div>
        </section>
    );
};
