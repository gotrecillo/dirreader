/**
 * Module depèndencies
 * */
var fs = require('fs')
var stdin = process.stdin
var stdout = process.stdout
var colors = require('colors')

colors.setTheme({
  error: 'red',
  info: 'green',
  warning: 'yellow'
})

function asyncFileExplorer (err, files) {
  var stats = []

  if (err) throw err

  console.log('')

  if (!files.length) {
    return console.log('No files to show!'.error)
  }
  console.log('Select wich file or directory you want to see\n'.info)

  // called for each file walked in the directory
  function file (i) {
    var filename = files[i]

    fs.stat(__dirname + '/' + filename, function (err, stat) {
      if (err) throw err
      stats[i] = stat
      if (stat.isDirectory()) {
        console.log((i + ' ' + filename + '/').info)
      } else {
        console.log((i + ' ' + filename).error)
      }
      i++
      if (i === files.length) {
        read()
      } else {
        file(i)
      }
    })
  }

  // read user input when files are shown
  function read () {
    console.log('')
    stdout.write('Enter your choice: '.warning)
    stdin.resume()
    stdin.setEncoding('utf8')
    stdin.on('data', option)
  }

  // called with the option supplied by the user
  function option (data) {
    var filename = files[Number(data)]
    if (!filename) {
      stdout.write('Enter a valid choice: '.error)
    } else if (stats[Number(data)].isDirectory()) {
      stdin.pause()
      fs.readdir(__dirname + '/' + filename, function (err, files) {
        if (err) throw err
        console.log('')
        console.log(' ( ' + files.length + ' files)')
        files.forEach(function (file) {
          console.log('-- ' + file)
        })
        console.log('')
      })
    } else {
      stdin.pause()
      fs.readFile(__dirname + '/' + filename, 'utf8', function (err, data) {
        if (err) throw err
        console.log('')
        console.log(data)
      })
    }
  }
  file(0)
}

fs.readdir(process.cwd(), asyncFileExplorer)
