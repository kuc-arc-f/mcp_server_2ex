use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::{future_to_promise, spawn_local};
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
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}


