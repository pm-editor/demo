import { Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView, NodeView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { Schema } from "prosemirror-model";

const pluginKey = new PluginKey('Test-Plugin');

class TestPluginView implements PluginView {
  container: HTMLElement;
  view: EditorView;
  constructor(view: EditorView) {
    this.container = document.createElement('div');
    this.view = view;
    this.view.dom.parentNode?.appendChild(this.container);
  }

  update(view: EditorView, state: EditorState) {
    const { isShowXXX } = pluginKey.getState(state);
    this.container.innerText = isShowXXX ? 'xxxx' : 'yyyy';
  }

  destroy() {
    this.container.remove();
  }
}

export const testPlugin = () => {

  return new Plugin({
    key: pluginKey,
    state: {
      init: () => {
        return {
          isShowXXX: false,
        }
      },
      apply(tr, value) {
        let isShowXXX: boolean = !!value.isShowXXX;

        if (true) {
          isShowXXX = true;
        }

        return { isShowXXX };
      },
    },
    props: {
      handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
        const pluginState = pluginKey.getState(view.state);

        if (pluginState.isShowXXX) {
          console.log('do something');
        }

        return false;
      },
    },
    view: (view) => {
      return new TestPluginView(view);
    }
  });
}