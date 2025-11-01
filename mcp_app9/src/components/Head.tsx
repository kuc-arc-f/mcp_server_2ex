//import { Routes, Route, Link } from 'react-router-dom';
import {Link } from 'react-router-dom';

function Page() {
  return (
  <div>
    <a href="/" className="font-bold ms-4" > Home </a>
    <a href="/about" className="ms-2 text-gray-400"> [ about ]</a>
    <a href="/todo" className="ms-2"> [ Todo ]</a>
    <hr className="my-2" />
  </div>
  );
}
export default Page;
