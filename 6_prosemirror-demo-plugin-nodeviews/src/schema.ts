import { nodes, marks } from "prosemirror-schema-basic";
import { Schema } from "prosemirror-model";

const customNodes = {
  block_tile: {
    content: 'block+',
    group: 'block',
    inline: false,
    defining: true,
    toDOM: () => {
      return ['div', { class: 'block_tile' }, 0]
    },
    parseDOM: [{ tag: 'div.block_tile' }]
  },
  custom_block: {
    group: 'block',
    selectable: true,
    dragable: true,
    atom: true,
    content: 'inline+',
    attrs: {
      id: { default: '' },
      version: { default: '' },
      fileName: { default: '' }
    },
    toDOM: () => {
      return ['div', { class: 'node-view' }]
    },
    parseDOM: [{
      tag: 'div.node-view', getAttrs(dom: HTMLElement) {
        return {
          id: dom.getAttribute('id'),
          version: dom.getAttribute('version'),
          fileName: dom.getAttribute('fileName'),
        }
      }
    }]
  }
};

export const schema = new Schema({
  nodes: Object.assign({}, nodes, customNodes),
  marks
});