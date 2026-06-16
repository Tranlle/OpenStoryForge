import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

import { animateHome } from "@renderer/features/home/home-motion";
import type { WorkspaceMode } from "@renderer/state/workspace-state";

export function useHomePageMotion({
  conversationId,
  workspaceMode
}: {
  conversationId: string;
  workspaceMode: WorkspaceMode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const welcomeLayerRef = useRef<HTMLDivElement>(null);
  const conversationLayerRef = useRef<HTMLDivElement>(null);
  const previousModeRef = useRef<WorkspaceMode | null>(null);
  const [displayMode, setDisplayMode] = useState<WorkspaceMode>(workspaceMode);

  useGSAP(
    () => {
      if (!rootRef.current || !welcomeLayerRef.current || !conversationLayerRef.current) {
        return undefined;
      }

      const cleanupReveal = animateHome(rootRef.current);
      const welcomeLayer = welcomeLayerRef.current;
      const conversationLayer = conversationLayerRef.current;
      const hero = welcomeLayer.querySelector<HTMLElement>("[data-home-hero]");
      const composer = welcomeLayer.querySelector<HTMLElement>("[data-home-composer]");
      const prompts = welcomeLayer.querySelector<HTMLElement>("[data-home-prompts]");
      const targetComposer = conversationLayer.querySelector<HTMLElement>("[data-conversation-composer]");
      const targetStream = conversationLayer.querySelector<HTMLElement>("[data-conversation-stream]");
      const previousMode = previousModeRef.current;

      if (!hero || !composer || !prompts || !targetComposer || !targetStream || previousMode === null) {
        if (workspaceMode === "new-conversation") {
          gsap.set(welcomeLayer, { autoAlpha: 1, pointerEvents: "auto" });
          gsap.set([hero, composer, prompts], { autoAlpha: 1, clearProps: "transform,filter,opacity" });
          gsap.set(conversationLayer, { autoAlpha: 0, pointerEvents: "none" });
          gsap.set(targetComposer ?? [], { clearProps: "opacity,transform,visibility,willChange" });
          gsap.set(targetStream ?? [], { clearProps: "transform,opacity" });
        } else {
          gsap.set(welcomeLayer, { autoAlpha: 0, pointerEvents: "none" });
          gsap.set(conversationLayer, { autoAlpha: 1, pointerEvents: "auto", clearProps: "transform,opacity" });
        }

        previousModeRef.current = workspaceMode;
        setDisplayMode(workspaceMode);

        return cleanupReveal;
      }

      if (previousMode === workspaceMode) {
        setDisplayMode(workspaceMode);
        return cleanupReveal;
      }

      let timeline: gsap.core.Timeline | undefined;
      let ghostComposer: HTMLElement | null = null;

      if (previousMode === "new-conversation" && workspaceMode === "conversation") {
        const rootRect = rootRef.current.getBoundingClientRect();
        const sourceComposerRect = composer.getBoundingClientRect();
        const targetComposerRect = targetComposer.getBoundingClientRect();
        const ghostDeltaX = targetComposerRect.left - sourceComposerRect.left;
        const ghostDeltaY = targetComposerRect.top - sourceComposerRect.top;
        const ghostScaleX = targetComposerRect.width / sourceComposerRect.width;
        const ghostScaleY = targetComposerRect.height / sourceComposerRect.height;

        ghostComposer = createComposerProxy(composer);
        ghostComposer.style.position = "absolute";
        ghostComposer.style.left = `${sourceComposerRect.left - rootRect.left}px`;
        ghostComposer.style.top = `${sourceComposerRect.top - rootRect.top}px`;
        ghostComposer.style.width = `${sourceComposerRect.width}px`;
        ghostComposer.style.height = `${sourceComposerRect.height}px`;
        ghostComposer.style.margin = "0";
        ghostComposer.style.zIndex = "30";
        ghostComposer.style.pointerEvents = "none";
        rootRef.current.appendChild(ghostComposer);

        timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => {
            gsap.set(welcomeLayer, { autoAlpha: 0, pointerEvents: "none" });
            gsap.set(conversationLayer, { autoAlpha: 1, pointerEvents: "auto", clearProps: "transform,opacity" });
            gsap.set(targetComposer, { clearProps: "opacity,visibility,transform,willChange" });
            gsap.set(targetStream, { clearProps: "transform,opacity" });
            gsap.set([hero, composer, prompts], { clearProps: "transform,opacity,filter,willChange" });
            ghostComposer?.remove();
            setDisplayMode("conversation");
          }
        });

        gsap.set(welcomeLayer, { autoAlpha: 1, pointerEvents: "none" });
        gsap.set(conversationLayer, { autoAlpha: 1, pointerEvents: "none" });
        gsap.set(composer, { willChange: "opacity" });
        gsap.set(targetComposer, {
          autoAlpha: 0,
          visibility: "hidden"
        });
        gsap.set(ghostComposer, { transformOrigin: "top left", willChange: "transform,opacity" });
        gsap.set(targetStream, {
          autoAlpha: 0,
          scaleY: 0.02,
          transformOrigin: "bottom center",
          y: 24
        });

        timeline
          .to(hero, { autoAlpha: 0, duration: 0.08, y: -20 }, 0)
          .to(prompts, { autoAlpha: 0, duration: 0.06, y: -12 }, 0.01)
          .set(composer, { autoAlpha: 0 }, 0.04)
          .to(
            ghostComposer,
            {
              duration: 0.38,
              ease: "power2.in",
              x: ghostDeltaX,
              y: ghostDeltaY,
              scaleX: ghostScaleX,
              scaleY: ghostScaleY
            },
            0.04
          )
          .set(targetComposer, { autoAlpha: 1, visibility: "inherit" }, 0.42)
          .to(ghostComposer, { autoAlpha: 0, duration: 0.06 }, 0.4)
          .to(
            targetStream,
            {
              autoAlpha: 1,
              duration: 0.34,
              ease: "power2.out",
              scaleY: 1,
              y: 0
            },
            0.42
          );
      } else if (previousMode === "conversation" && workspaceMode === "new-conversation") {
        const rootRect = rootRef.current.getBoundingClientRect();
        const sourceComposerRect = targetComposer.getBoundingClientRect();
        const targetWelcomeRect = composer.getBoundingClientRect();
        const ghostDeltaX = targetWelcomeRect.left - sourceComposerRect.left;
        const ghostDeltaY = targetWelcomeRect.top - sourceComposerRect.top;
        const ghostScaleX = targetWelcomeRect.width / sourceComposerRect.width;
        const ghostScaleY = targetWelcomeRect.height / sourceComposerRect.height;

        ghostComposer = createComposerProxy(targetComposer);
        ghostComposer.style.position = "absolute";
        ghostComposer.style.left = `${sourceComposerRect.left - rootRect.left}px`;
        ghostComposer.style.top = `${sourceComposerRect.top - rootRect.top}px`;
        ghostComposer.style.width = `${sourceComposerRect.width}px`;
        ghostComposer.style.height = `${sourceComposerRect.height}px`;
        ghostComposer.style.margin = "0";
        ghostComposer.style.zIndex = "30";
        ghostComposer.style.pointerEvents = "none";
        rootRef.current.appendChild(ghostComposer);

        timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => {
            gsap.set(conversationLayer, { autoAlpha: 0, pointerEvents: "none" });
            gsap.set(welcomeLayer, { autoAlpha: 1, pointerEvents: "auto" });
            gsap.set([hero, composer, prompts], { clearProps: "transform,opacity,filter,willChange" });
            gsap.set(targetComposer, { clearProps: "opacity,visibility,transform,willChange" });
            gsap.set(targetStream, { clearProps: "transform,opacity" });
            ghostComposer?.remove();
            setDisplayMode("new-conversation");
          }
        });

        gsap.set(welcomeLayer, { autoAlpha: 1, pointerEvents: "none" });
        gsap.set([hero, composer, prompts], { autoAlpha: 0 });
        gsap.set(composer, { autoAlpha: 0 });
        gsap.set(targetComposer, { clearProps: "opacity,transform,visibility,willChange" });
        gsap.set(targetComposer, { autoAlpha: 0 });
        gsap.set(targetStream, { clearProps: "transform,opacity" });
        gsap.set(ghostComposer, { transformOrigin: "top left", willChange: "transform,opacity" });

        timeline
          .to(conversationLayer, { autoAlpha: 0, duration: 0.18 }, 0)
          .to(hero, { autoAlpha: 1, duration: 0.14, y: 0 }, 0.06)
          .to(
            ghostComposer,
            {
              duration: 0.34,
              ease: "power3.out",
              x: ghostDeltaX,
              y: ghostDeltaY,
              scaleX: ghostScaleX,
              scaleY: ghostScaleY
            },
            0.08
          )
          .set(composer, { autoAlpha: 1 }, 0.42)
          .to(ghostComposer, { autoAlpha: 0, duration: 0.06 }, 0.4)
          .to(prompts, { autoAlpha: 1, duration: 0.14, y: 0 }, 0.22);
      }

      previousModeRef.current = workspaceMode;

      return () => {
        timeline?.kill();
        ghostComposer?.remove();
        cleanupReveal();
      };
    },
    { dependencies: [workspaceMode, conversationId], scope: rootRef }
  );

  const isTransitioning = displayMode !== workspaceMode;

  return {
    conversationLayerRef,
    displayMode,
    isTransitioning,
    rootRef,
    welcomeLayerRef
  };
}

function createComposerProxy(sourceComposer: HTMLElement): HTMLElement {
  const sourceStyle = window.getComputedStyle(sourceComposer);
  const proxy = document.createElement("div");
  const body = document.createElement("div");
  const footer = document.createElement("div");
  const divider = document.createElement("div");

  proxy.style.borderRadius = sourceStyle.borderRadius;
  proxy.style.background = sourceStyle.background;
  proxy.style.boxShadow = sourceStyle.boxShadow;
  proxy.style.backdropFilter = sourceStyle.backdropFilter;
  proxy.style.setProperty("-webkit-backdrop-filter", sourceStyle.getPropertyValue("-webkit-backdrop-filter"));
  proxy.style.overflow = "hidden";
  proxy.style.display = "flex";
  proxy.style.flexDirection = "column";
  proxy.style.padding = sourceStyle.padding;
  proxy.style.gap = "0";

  body.style.flex = "1";
  body.style.borderRadius = "18px";
  body.style.background = "linear-gradient(180deg, hsl(var(--foreground)/0.06), hsl(var(--foreground)/0.03))";
  body.style.opacity = "0.7";

  divider.style.height = "1px";
  divider.style.margin = "12px 0";
  divider.style.background = "hsl(var(--border)/0.16)";

  footer.style.height = "44px";
  footer.style.borderRadius = "16px";
  footer.style.background = "linear-gradient(90deg, hsl(var(--foreground)/0.08), hsl(var(--foreground)/0.03))";
  footer.style.opacity = "0.8";

  proxy.append(body, divider, footer);

  return proxy;
}
