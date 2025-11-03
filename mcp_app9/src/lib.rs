use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::{future_to_promise, spawn_local};
use pulldown_cmark::{Parser, html};
use serde::{Serialize, Deserialize};
//use js_sys::Promise;

#[derive(Serialize, Deserialize)]
pub struct MyData {
    data: String,
    ret: i32,
}
#[derive(Serialize, Deserialize)]
struct GenericResponse {
    ret: u16,
    data: String,
}
#[wasm_bindgen]
pub fn greet_async(name: String) -> js_sys::Promise {
    future_to_promise(async move {
        let result = format!("Hello from Rust (async), {}!", name);

        Ok(JsValue::from_str(&result))
    })
}

#[wasm_bindgen]
pub fn render_test(name: &str) -> String {
   let raw_string : String= r#"
<html>
    <head>
        <title>welcome</title>
        <link href="/static/main.css" rel="stylesheet" /> 
    </head>
    <body>hoge
    </body>
</html>
"#.to_string();    
  return raw_string;
}

#[wasm_bindgen]
pub fn render_erchart_show(value: &str) -> String {
  let out = format!(r#"
    <html>
        <head>
            <title>welcome</title>
        </head>
        <body>
            <pre class="mermaid">{}</pre>
            <script type="module">
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.12.1/+esm'
            </script>
        </body>
    </html>
    "#
  , value);
  return out;
}

#[wasm_bindgen]
pub fn render_md_show(value: &str) -> String {
    let result = format!(r#"
        <html>
            <head>
                <title>welcome</title>
                <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
            </head>
            <body>
                <div class="max-w-6xl mx-auto px-4">
                    <a href="/mark_down">
                        <button 
                        class="border border-blue-500 text-blue-500 bg-white font-bold py-1 px-2 rounded mt-2 mx-2">
                            Back
                        </button>
                    </a>
                    <hr class="my-2"/>
                    {}
                </div>
            </body>
        </html>
        "#
    , value);
    return result;
}

#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[wasm_bindgen]
pub fn foo() -> String {
    let markdown_input = "# タイトル\n\nこれは **Markdown** テキストです。";

    // Markdown → HTML 変換
    let parser = Parser::new(markdown_input);

    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);

    println!("{}", html_output);
    return html_output
}

#[wasm_bindgen]
pub fn convert_md(value: &str) -> String {
    let parser = Parser::new(value);

    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);

    println!("{}", html_output);
    return html_output
}