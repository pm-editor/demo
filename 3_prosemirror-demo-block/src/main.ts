import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { nodes, marks } from "prosemirror-schema-basic";
import { DOMParser, Schema } from "prosemirror-model";

import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import { history, undo, redo } from 'prosemirror-history';

import './style.css';
import './prosemirror.css';

const id = 'prosemirror-editor';

// 初始化一个p段落
const content = new window.DOMParser().parseFromString(
  ``,
  "text/html"
).body;

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
  }
};

const schema = new Schema({
  nodes: Object.assign({}, nodes, customNodes),
  marks
});

export const mount = () => {
  const el = document.querySelector(`#${id}`);

  // 1. 提供schema (文档结构， 这里暂时用现成的)
  // 2. 创建一个editor state数据实例
  const editorState = EditorState.create({
    // schema
    doc: DOMParser.fromSchema(schema).parse(content),
    plugins: [
      keymap(baseKeymap),
      history(),
      keymap({ "Mod-z": undo, "Mod-y": redo }),
    ]
  });

  // 3. 创建editor view编辑器视图实例
  const editorView = new EditorView(el, {
    state: editorState
  });

  window.editorView = editorView;

  const blockTileButton = document.querySelector('#blockTileButton');
  blockTileButton?.addEventListener('click', () => {
    const { state, dispatch } = editorView;
    const { schema, tr, selection } = state;
    const textNode = schema.text('this is block_tile p');
    const pNode = schema.nodes.paragraph.create({}, textNode);
    const bNode = schema.nodes.block_tile.create({}, pNode);
    const pos = selection.from;
    tr.insert(pos, bNode);

    const textNode1 = schema.text('this is block_tile h1');
    const h1Node = schema.nodes.heading.create({ level: 1 }, textNode1);
    const bNode1 = schema.nodes.block_tile.create({}, h1Node);
    tr.insert(pos + bNode.nodeSize + 1, bNode1);

    dispatch(tr);
  });

  const headingButton = document.querySelector('#headingButton');
  const strongButton = document.querySelector('#strongButton');

  headingButton?.addEventListener('click', () => {
    const { state, dispatch } = editorView;
    const { schema, tr, selection } = state;
    const textNode = schema.text('this is h3');
    const node = schema.nodes.heading.create({ level: 3 }, textNode);
    const pos = selection.from;

    tr.insert(pos, node);
    dispatch(tr);
  });

  strongButton?.addEventListener('click', () => {
    const { state, dispatch } = editorView;
    const { schema, tr, selection } = state;
    const { from, to } = selection;

    tr.addMark(from, to, schema.marks.strong.create());
    dispatch(tr);
  });
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div>
      <button id="headingButton">插入h1</button>
      <button id="strongButton">加粗</button>
      <button id="blockTileButton">blockTile</button>
    </div>
    <div id="${id}"></div>
  </div>
  `;

mount();



