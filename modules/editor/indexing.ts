async function getIndex(name: string) {
  // fetch xml index
  const rawxml = await fetch(name).then((res) => res.text());

  if (!rawxml) {
    throw new Error("No index found");
  }
  // parse xml
  const xml = new window.DOMParser().parseFromString(rawxml, "text/xml");
  const ALLFILES = xmlToJson(xml);

  if (!ALLFILES?.listBucketResult?.contents) {
    throw new Error("no listbucketresult");
  }
  ALLFILES.listBucketResult.contents = ALLFILES.listBucketResult.contents.map(
    (x) => {
      x.extension = x.key.split(".").pop();
      x.hrsize = readableFileSize(x.size);
      if (x.extension.match(/(jpg|jpeg|png|gif|bmp|webp|avif)/i)) {
        x.type = "image";
      } else if (x.extension.match(/(mp4|mov|webm|mkv|avi)/i)) {
        x.type = "video";
      } else if (x.extension.match(/(mp3|wav|ogg|flac)/i)) {
        x.type = "audio";
      } else if (x.extension.match(/(pdf)/i)) {
        x.type = "pdf";
      } else {
        x.type = "other";
      }
      return x;
    },
  );
  return ALLFILES;
}

function xmlToJson(xml) {
  if (typeof xml === "string") {
    const parser = new DOMParser();
    xml = parser.parseFromString(xml, "text/xml");
  }

  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    // text
    obj = xml.nodeValue;
  }

  // do children
  // If just one text node inside
  if (
    xml.hasChildNodes() &&
    xml.childNodes.length === 1 &&
    xml.childNodes[0].nodeType === 3
  ) {
    obj = xml.childNodes[0].nodeValue;
  } else if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      // camelCase
      nodeName = nodeName.charAt(0).toLowerCase() + nodeName.slice(1);
      if (typeof obj[nodeName] == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

export default async (name: string | undefined) => {
  if (name === undefined) return false;
  return {
    name,
  };
};
