var path = require('path')
var dir = '../test/specs/'
;['full'].forEach(script => {
  require(path.join(dir, script))
})
