import { Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { EditorView, NodeView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { Node } from 'prosemirror-model';

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


class TestNodeViews implements NodeView {
  public dom: HTMLElement;
  private node: Node;
  private view: EditorView;
  private getPos: () => number | undefined;

  constructor(node: Node, view: EditorView, getPos: () => number | undefined) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    const attrs = node?.attrs || {};
    this.dom = document.createElement('nodeview');

    const container = document.createElement('div');
    container.innerText = `id ${attrs.id}, version ${attrs.version} fileName ${attrs.fileName}`;

    this.dom.append(container);
  }

  selectNode() {
    this.dom.classList.add("active");
    console.log('node view select');
  }

  deselectNode() {
    this.dom.classList.remove("active")
    console.log('node view dis select');
  }

  setSelection(anchor, head) {
    console.log('node view set selection', anchor, head);
  }

  // node节点更新时触发
  update(node: Node, decoration) {
    console.log('node view update', node);

    // return true则阻止默认的修改
    return false;
  }

  destroy() {
    this.dom.remove();
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
      nodeViews: {
        custom_block: (node, view, getPos) => new TestNodeViews(node, view, getPos)
      }
    },
    view: (view) => {
      return new TestPluginView(view);
    }
  });
}