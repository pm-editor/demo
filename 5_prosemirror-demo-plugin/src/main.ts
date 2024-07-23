import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { DOMParser } from "prosemirror-model";

import { schema } from './schema';

import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import { history, undo, redo } from 'prosemirror-history';
import { testPlugin } from './plugin';

import './style.css';
import './prosemirror.css';

const id = 'prosemirror-editor';

// 初始化一个p段落
// 初始化一个p段落
const content = new window.DOMParser().parseFromString(
  `<div class="block_tile">
    <p>中文</p>
    <p>english</p>
    <h1>h1</h1>
    <div class="node-view" id="test-id" version="234533" fileName="xxxx.txt"></div>
  </div>
  `,
  "text/html"
).body;

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
      testPlugin(),
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

  const nodeViewsButton = document.querySelector('#nodeViewsButton');

  nodeViewsButton?.addEventListener('click', () => {
    const { state, dispatch } = editorView;
    const { schema, tr, selection } = state;

    const node = selection.$from.nodeAfter;

    if (node?.type.name === 'custom_block') {
      // const newAttrs = Object.assign({}, node.attrs, { fileName: "newFileName.txt" })
      tr.setNodeAttribute(selection.from, 'fileName', 'newFileName.txt');
    }
    // tr.insert(pos, node);
    dispatch(tr);
  });
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div>
      <button id="headingButton">插入h1</button>
      <button id="strongButton">加粗</button>
      <button id="blockTileButton">blockTile</button>
      <button id="nodeViewsButton">tr node view</button>
    </div>
    <div id="${id}"></div>
  </div>
  `;

mount();



