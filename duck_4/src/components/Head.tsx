//import { Routes, Route, Link } from 'react-router-dom';
import {Link } from 'react-router-dom';

function Page() {
  return (
  <div>
    <a href="/" className="font-bold ms-4" > Home </a>
    <a href="/todo11" className="font-bold ms-4" > todo11 </a>
    <a href="/todo12" className="font-bold ms-4" > todo12 </a>
    <a href="/todo13" className="font-bold ms-4" > todo13 </a>
    <a href="/vuetodo11" className="font-bold ms-4" > vuetodo11 </a>
    <a href="/about" className="ms-2 text-gray-400"> [ about ]</a>
    {/* gitclone */}
    <hr className="my-2" />
    <span className="ms-4"><strong>GitClone</strong></span>
    <a href={`/git_count`} className="font-bold ms-4" > [ git_count ] </a>
    <a href={`/erchart`} className="font-bold ms-4" > [ ErChart ] </a>
    <a href={`/plan`} className="font-bold ms-4" > [ Plan ] </a>
    <a href={`/clock`} className="font-bold ms-4" > [ Clock ] </a>
    <a href={`/task_project`} className="font-bold ms-4" > [ TaskProject ] </a>

    <hr className="my-2" />
    <span className="ms-4"><strong>Demo</strong></span>
    <a href={`/hp1`} className="font-bold ms-4" > [ hp1.html ] </a>
    <a href={`/hp2`} className="font-bold ms-4" > [ hp2.html ] </a>
    <a href={`/hp3`} className="font-bold ms-4" > [ hp3.html ] </a>
    <a href={`/hp4`} className="font-bold ms-4" > [ hp4.html ] </a>
    <hr className="my-2" />
    <span className="ms-4"><strong>SheetApp</strong></span>
    <a href={`/sheettodo`} className="font-bold ms-4" > [ SheetTodo ] </a>
    <a href={`/sheetprice`} className="font-bold ms-4" > [ SheetPrice ] </a>
    <hr className="my-2" />
  </div>
  );
}
export default Page;
/*
<Link to="/" className="font-bold ms-4">Home</Link>
<Link to="/about" class="ms-2">[ about ]</Link>
*/
