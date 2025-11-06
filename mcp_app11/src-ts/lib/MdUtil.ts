const MdUtil = {

   convertHtmTag: function (value) {
    try{
      value = value.replace(/<h1>/g, '<h1 class="text-4xl font-bold">');
      value = value.replace(/<h3>/g, '<h3 class="text-3xl font-bold">');
      value = value.replace(/<hr \/>/g, '<hr class="my-2" />');
      value = value.replace(/<pre><code>/g, '<pre class="bg-gray-100 p-2 rounded"><code>');
      return value;
    }catch(e){ 
      console.error(e) 
      throw new Error("error , convertHtmTag");
    }
   },
}
export default MdUtil;

