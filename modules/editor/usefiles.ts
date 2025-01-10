function xmlToJson(xml) {
  if (typeof xml === "string") {
    parser = new DOMParser();
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

function readableFileSize(attachmentSize) {
  const DEFAULT_SIZE = 0;
  const fileSize = attachmentSize ?? DEFAULT_SIZE;

  if (!fileSize) {
    return `${DEFAULT_SIZE}kb`;
  }

  const sizeInKb = fileSize / 1024;

  if (sizeInKb > 1024) {
    return `${(sizeInKb / 1024).toFixed(2)}mb`;
  } else {
    return `${sizeInKb.toFixed(2)}kb`;
  }
}

export const useFiles = () => {
  const { data: rawxml } = useFetch(
    "https://cathie.lon1.digitaloceanspaces.com",
  );
  let ALLFILES = false;
  if (rawxml.value && import.meta.client) {
    const xml = new window.DOMParser().parseFromString(
      rawxml.value,
      "text/xml",
    );
    ALLFILES = xmlToJson(xml);
  }
  if (ALLFILES?.listBucketResult?.contents) {
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
  }
  return ALLFILES;
};
