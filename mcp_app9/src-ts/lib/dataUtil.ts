

export function sheetGetItems(values){
  let ret = [];
  values.forEach((row, idx) => {
    if(idx > 0 && row[0]) {
      let target = {
        id: row[0] ,
        title: row[1] ,
        date: row[2] ,
      }
      ret.push(target);
    }
  });
  return ret;
}