import {
  Component,
  createEffect,
  mergeProps,
  ParentProps,
  Show,
} from 'solid-js';

import anime from 'animejs';
import { Portal } from 'solid-js/web';

import './index.scss';

export interface ModalProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onClose: () => void;
  fullscreen?: boolean;
  open: boolean;
}

const Modal: Component<ParentProps<ModalProps>> = (_props) => {
  const props = mergeProps({ size: 'md', fullscreen: false }, _props);
  let modalRef: HTMLDivElement;
  let animation: anime.AnimeInstance;

  createEffect(() => {
    if (props.open) {
      document.body.classList.add('modal--open');
      animation = anime
        .timeline({
          easing: 'easeInOutQuad',
          duration: 500,
        })
        .add({
          targets: modalRef.querySelector('.modal__backdrop'),
          opacity: [0, 1],
        })
        .add(
          {
            targets: modalRef.querySelector('.modal__content'),
            opacity: [0, 1],
            translateY: [-80, 0],
            easing: 'easeInOutQuad',
          },
          '-=200'
        );
    } else document.body.classList.remove('modal--open');
  });

  return (
    <Show when={props.open}>
      <Portal>
        <div class="modal" ref={modalRef}>
          <div
            class="modal__backdrop"
            data-testid="modal__backdrop"
            onClick={async () => {
              animation.reverse();
              animation.play();
              await animation.finished;
              props.onClose();
            }}
          />
          <div
            class={`modal__content container-${props.size}`}
            classList={{ 'modal--fullscreen': props.fullscreen }}
            data-testid="modal__content"
          >
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default Modal;
