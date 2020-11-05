

export default {
  crossImage: function(src,opt={} )  {
if (!src){
return "";
}
let {width,height} = opt
let distImage =src
if(src.indexOf('.webp')>-1 || src.indexOf('.svg')>-1  || src.indexOf('.gif')>-1  || src.indexOf('x-oss-process')>-1) {
  return src
}
if(src.indexOf('noOssProcess')==-1 ){
if (src.indexOf('aliyuncs.com')>-1 || src.indexOf('images.allcitygo.com')>-1){
  if(src.indexOf('http://')>-1 ) src = src.replace('http://','https://')
let  ossProcess =  width?`?x-oss-process=image/resize,m_fill,h_${height||width},w_${width}/format,webp`:'?x-oss-process=image/format,webp';
distImage  =  `${src}${ossProcess}`;
}
}
return distImage;
}

}