export function MP() {
  return new Promise(function(resolve, reject) {
    window.onload = function() {
      resolve(window.BMap)
    }
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src =
      'http://api.map.baidu.com/api?v=3.0&ak=sogaSMx0OygfdSrhVlqt3nYQGGeDimNG&callback=init'
    script.onerror = reject
    document.head.appendChild(script)
  })
}
