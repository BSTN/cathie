
import { parse, stringify } from 'yaml'
import fs from 'fs';
import { NodeHtmlMarkdown } from 'node-html-markdown'
import data from './data/data.json'  with { type: "json" };
// console.log(NodeHtmlMarkdown.translate(data.contact));
// import exhibitions from './data/exhibitions.json'  with { type: "json" };

// for(let i in exhibitions) {
//   let exhibition = exhibitions[i];
//   let exhibitionFile = `./data/exhibitions/${exhibition.slug}.yml`;
//   exhibition.description = NodeHtmlMarkdown.translate(exhibition.description.replaceAll("\\/", "/"));
//   exhibition.images = exhibition.images.map(x => {
//     x.description = NodeHtmlMarkdown.translate(x.description.replaceAll("\\/", "/"));
//     x.year = parseInt(x.caption || 0)
//     x.url = x.url.replace('https://cathiepilkington.com', '');
//     delete x.caption;
//     return x
//   })
//   delete exhibition.slug;
//   exhibition.date = '01-01-' + exhibition.images[0].year;

//   exhibition.thumb = exhibition.thumb.replace('https://cathiepilkington.com', '');
  
//   const yaml = stringify(exhibition)
//   fs.writeFileSync(exhibitionFile, yaml, function(err) {
//     if(err) {
//       console.log(err);
//     } else {
//       console.log(`Wrote ${exhibitionFile}`);
//     }
//   });
// }

