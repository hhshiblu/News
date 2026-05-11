const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.js') || file.endsWith('.jsx')) {
             results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('c:\\Users\\Shiblu\\newsportal\\client\\src', (err, results) => {
  if (err) throw err;
  let count = 0;
  results.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
      .replace(/authorId/g, 'reporterId')
      .replace(/author_id/g, 'reporter_id')
      .replace(/author/g, 'reporter')
      .replace(/Author/g, 'Reporter')
      .replace(/AUTHORS/g, 'REPORTERS');
    
    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      count++;
    }
  });
  console.log(`Updated ${count} files.`);
});
