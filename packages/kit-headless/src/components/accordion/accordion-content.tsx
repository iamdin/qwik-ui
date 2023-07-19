import {
  component$,
  useStylesScoped$,
  Slot,
  useContext,
  useSignal,
  useTask$,
  $,
  useVisibleTask$,
  type QwikIntrinsicElements,
} from '@builder.io/qwik';

import {
  accordionItemContextId,
  accordionRootContextId,
} from './accordion-context-id';

import { isBrowser } from '@builder.io/qwik/build';

export type ContentProps = QwikIntrinsicElements['div'];

export const AccordionContent = component$(({ ...props }: ContentProps) => {
  const contextService = useContext(accordionRootContextId);
  const ref = useSignal<HTMLElement>();
  const contentElement = ref.value;
  const itemContext = useContext(accordionItemContextId);
  const contentId = `${itemContext.itemId}-content`;
  const isTriggerExpandedSig = itemContext.isTriggerExpandedSig;
  const isContentHiddenSig = useSignal<boolean>(true);
  const animated = contextService.animated;
  const totalHeightSig = useSignal<number>(0);

  const hideContent$ = $(() => {
    if (!isTriggerExpandedSig.value) {
      isContentHiddenSig.value = true;
    }
  });

  useStylesScoped$(`
    [data-state] {
      overflow: hidden;
    }

    /* check global.css utilites layer for animation */
    @keyframes accordion-open {
      0% {
        height: 0;
      }
      100% {
        height: var(--qwikui-collapsible-content-height);
      }
    }
  
    @keyframes accordion-close {
        0% {
          height: var(--qwikui-collapsible-content-height);
        }
        100% {
          height: 0;
        }
      }
  `);

  /* allows animate / transition from display none */
  useTask$(function animateContentTask({ track }) {
    track(() => isTriggerExpandedSig.value);

    if (animated && isTriggerExpandedSig.value) {
      isContentHiddenSig.value = false;
    }
  });

  /* calculates height of the content container based on children */
  useVisibleTask$(function calculateHeightVisibleTask() {
    if (animated) {
      totalHeightSig.value = 0;

      const contentChildren = Array.from(
        contentElement?.children!
      ) as HTMLElement[];
      contentChildren.forEach((element, index) => {
        totalHeightSig.value += element.offsetHeight;

        if (index === contentChildren.length - 1) {
          contentElement?.style.setProperty(
            '--qwikui-collapsible-content-height',
            `${totalHeightSig.value}px`
          );
        }
      });
    }
  });

  return (
    <>
      <div
        ref={ref}
        role="region"
        id={contentId}
        data-content-id={contentId}
        data-state={isTriggerExpandedSig.value ? 'open' : 'closed'}
        hidden={
          animated ? isContentHiddenSig.value : !isTriggerExpandedSig.value
        }
        onAnimationEnd$={[hideContent$, props.onAnimationEnd$]}
        onTransitionEnd$={[hideContent$, props.onTransitionEnd$]}
        style={{
          ['--qwikui-accordion-content-height' as string]:
            'var(--qwikui-collapsible-content-height)',
          ['--qwikui-accordion-content-width' as string]:
            'var(--qwikui-collapsible-content-width)',
        }}
        {...props}
      >
        <Slot />
      </div>
    </>
  );
});
