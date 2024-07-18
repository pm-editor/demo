import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { schema } from "prosemirror-schema-basic";
import { DOMParser } from "prosemirror-model";

import './style.css';
import './prosemirror.css';

const id = 'prosemirror-editor';

// 初始化一个p段落
const content = new window.DOMParser().parseFromString(
  `<p>this is paragraph</p>
   <h1>this is h1</h1>
   <h2>this is h2</h2>`,
  "text/html"
).body;

export const mount = () => {
  const el = document.querySelector(`#${id}`);

  // 1. 提供schema (文档结构， 这里暂时用现成的)
  // 2. 创建一个editor state数据实例
  const editorState = EditorState.create({
    // schema
    doc: DOMParser.fromSchema(schema).parse(content),
  });

  // 3. 创建editor view编辑器视图实例
  const editorView = new EditorView(el, {
    state: editorState
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
    </div>
    <div id="${id}"></div>
  </div>
  `;

mount();



