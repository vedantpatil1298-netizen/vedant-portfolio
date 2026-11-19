const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const flow = require('../src/scripts/approval-flow.js');
test('only an older adult may resolve the proposed change', () => {
  for(const role of ['family','adult']) assert.equal(flow.apply('current',role,'propose'),'current');
  assert.equal(flow.apply('current','caretaker','propose'),'pending');
  for(const role of ['family','caretaker']) assert.deepEqual(flow.actions('pending',role),[]);
  for(const [action,end] of [['approve','approved'],['decline','declined']]){
    assert.equal(flow.apply('pending','adult',action),end);
    assert.equal(flow.apply(end,'adult',action),end);
  }
});
for(const page of ['index.html','projects/carecircle.html']){
  test(page + ' links to existing pages, assets and anchors', () => {
    const file = path.join(__dirname,'../src',page);
    for(const [,link] of fs.readFileSync(file,'utf8').matchAll(/(?:href|src)="([^"]+)"/g)){
      if(link.startsWith('https://')) continue;
      const [target,hash] = link.split('#');
      const dest = target ? path.resolve(path.dirname(file),target) : file;
      assert.ok(fs.existsSync(dest),link);
      if(hash) assert.ok(fs.readFileSync(dest,'utf8').includes('id="'+hash+'"'),link);
    }
  });
}
