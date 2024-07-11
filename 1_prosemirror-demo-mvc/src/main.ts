import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
// import { schema } from "prosemirror-schema-basic";
import { Schema, DOMParser } from "prosemirror-model";

import './style.css';
import './prosemirror.css';

const id = 'prosemirror-editor';

const schema = new Schema({
  nodes: {
    /// 定义最顶层doc节点
    doc: {
      content: "block+" // 子节点为多个block
    },
    /// 定义最底层text节点
    text: {
      group: "inline"
    },
    /// 定义段落节点
    paragraph: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM() { return ['p', 0] }
    },
    heading: {
      attrs: {level: {default: 1}},
      content: "inline*",
      group: "block",
      defining: true,
      parseDOM: [{tag: "h1", attrs: {level: 1}},
                 {tag: "h2", attrs: {level: 2}},
                 {tag: "h3", attrs: {level: 3}},
                 {tag: "h4", attrs: {level: 4}},
                 {tag: "h5", attrs: {level: 5}},
                 {tag: "h6", attrs: {level: 6}}],
      toDOM(node) { return ["h" + node.attrs.level, 0] }
    }
  },
  marks: {}
});

// 初始化一个p段落
const content = new window.DOMParser().parseFromString(
  `<p>this is paragraph</p>
   <h1>this is h1</h1>`,
  "text/html"
).body;

export const mount = () => {
  const el = document.querySelector(`#${id}`);

  // 1. 提供schema (文档结构， 这里暂时用现成的)
  // 2. 创建一个editor state数据实例
  const editorState = EditorState.create({
    // schema
    doc: DOMParser.fromSchema(schema).parse(content)
  });

  // 3. 创建editor view编辑器视图实例
  const editorView = new EditorView(el, {
    state: editorState
  });

  console.log(editorState, editorView)
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<div id="${id}"></div>`;

mount();



