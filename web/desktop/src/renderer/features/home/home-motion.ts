import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateHome(root: HTMLElement): () => void {
  const context = gsap.context(() => {
    gsap.from("[data-reveal]", {
      y: 36,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.08
    });

    gsap.fromTo(
      "[data-word]",
      { opacity: 0.18, y: 12 },
      {
        opacity: 1,
        y: 0,
        ease: "none",
        stagger: 0.08,
        scrollTrigger: {
          trigger: "[data-word-line]",
          start: "top 78%",
          end: "bottom 44%",
          scrub: true
        }
      }
    );

    gsap.fromTo(
      "[data-scale-media]",
      { scale: 0.86, opacity: 0.72 },
      {
        scale: 1,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-scale-media]",
          start: "top 86%",
          end: "bottom 54%",
          scrub: true
        }
      }
    );
  }, root);

  return () => context.revert();
}
