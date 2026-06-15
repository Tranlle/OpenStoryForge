import gsap from "gsap";

export function animateHome(root: HTMLElement): () => void {
  const context = gsap.context(() => {
    gsap.from("[data-reveal]", {
      y: 22,
      opacity: 0.82,
      duration: 0.65,
      ease: "power3.out",
      stagger: 0.08
    });
  }, root);

  return () => context.revert();
}
