import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { ConversationWorkspace } from "@renderer/features/home/conversation-workspace";
import { animateHome } from "@renderer/features/home/home-motion";
import { NewConversationWorkspace } from "@renderer/features/home/new-conversation-workspace";
import type { ConversationRecord, CreateConversationInput } from "@renderer/features/home/home.types";
import { cn } from "@renderer/lib/utils";

type HomePageProps = {
  conversation: ConversationRecord;
  onCreateConversation: (input: CreateConversationInput) => void;
  workspaceMode: "conversation" | "new-conversation";
};

export function HomePage({ conversation, onCreateConversation, workspaceMode }: HomePageProps): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const welcomeLayerRef = useRef<HTMLDivElement>(null);
  const conversationLayerRef = useRef<HTMLDivElement>(null);
  const previousModeRef = useRef<typeof workspaceMode | null>(null);

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
          gsap.set(targetComposer ?? [], { clearProps: "opacity" });
          gsap.set(targetStream ?? [], { clearProps: "transform,opacity" });
        } else {
          gsap.set(welcomeLayer, { autoAlpha: 0, pointerEvents: "none" });
          gsap.set(conversationLayer, { autoAlpha: 1, pointerEvents: "auto", clearProps: "transform,opacity" });
        }

        previousModeRef.current = workspaceMode;

        return cleanupReveal;
      }

      let timeline: gsap.core.Timeline | undefined;

      if (previousMode === "new-conversation" && workspaceMode === "conversation") {
        const sourceComposerRect = composer.getBoundingClientRect();
        const targetComposerRect = targetComposer.getBoundingClientRect();
        const targetComposerOffsetX = sourceComposerRect.left - targetComposerRect.left;
        const targetComposerOffsetY = sourceComposerRect.top - targetComposerRect.top;
        const targetComposerScaleX = sourceComposerRect.width / targetComposerRect.width;
        const targetComposerScaleY = sourceComposerRect.height / targetComposerRect.height;

        timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => {
            gsap.set(welcomeLayer, { autoAlpha: 0, pointerEvents: "none" });
            gsap.set(conversationLayer, { pointerEvents: "auto", clearProps: "transform,opacity" });
            gsap.set(targetComposer, { clearProps: "opacity,visibility,transform,willChange" });
            gsap.set(targetStream, { clearProps: "transform,opacity" });
            gsap.set(composer, { clearProps: "transform,opacity,willChange" });
          }
        });

        gsap.set(welcomeLayer, { autoAlpha: 1, pointerEvents: "none" });
        gsap.set(conversationLayer, { autoAlpha: 1, pointerEvents: "none" });
        gsap.set(composer, { willChange: "opacity" });
        gsap.set(targetComposer, {
          autoAlpha: 1,
          visibility: "inherit",
          transformOrigin: "top left",
          willChange: "transform,opacity",
          x: targetComposerOffsetX,
          y: targetComposerOffsetY,
          scaleX: targetComposerScaleX,
          scaleY: targetComposerScaleY
        });
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
            targetComposer,
            {
              duration: 0.38,
              ease: "power2.in",
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1
            },
            0.04
          )
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
        timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => {
            gsap.set(conversationLayer, { autoAlpha: 0, pointerEvents: "none" });
            gsap.set(welcomeLayer, { pointerEvents: "auto" });
          }
        });

        gsap.set(welcomeLayer, { autoAlpha: 1, pointerEvents: "none" });
        gsap.set([hero, composer, prompts], { autoAlpha: 0 });
        gsap.set(composer, { y: 260, scaleY: 0.62, transformOrigin: "top center" });
        gsap.set(targetComposer, { clearProps: "opacity" });
        gsap.set(targetStream, { clearProps: "transform,opacity" });

        timeline
          .to(conversationLayer, { autoAlpha: 0, duration: 0.18, y: 80 }, 0)
          .to(hero, { autoAlpha: 1, duration: 0.14, y: 0 }, 0.06)
          .to(composer, { autoAlpha: 1, duration: 0.34, ease: "power3.out", y: 0, scaleY: 1 }, 0.1)
          .to(prompts, { autoAlpha: 1, duration: 0.14, y: 0 }, 0.22);
      }

      previousModeRef.current = workspaceMode;

      return () => {
        timeline?.kill();
        cleanupReveal();
      };
    },
    { dependencies: [workspaceMode, conversation.id], scope: rootRef }
  );

  return (
    <div ref={rootRef} className="relative h-full min-h-[720px] overflow-hidden">
      <div
        ref={welcomeLayerRef}
        aria-hidden={workspaceMode !== "new-conversation"}
        className={cn(
          "absolute inset-0",
          workspaceMode === "new-conversation" ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <NewConversationWorkspace onCreateConversation={onCreateConversation} workspaceMode={workspaceMode} />
      </div>

      <div
        ref={conversationLayerRef}
        aria-hidden={workspaceMode !== "conversation"}
        className={cn(
          "absolute inset-0",
          workspaceMode === "conversation" ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <ConversationWorkspace conversation={conversation} key={conversation.id} />
      </div>
    </div>
  );
}
