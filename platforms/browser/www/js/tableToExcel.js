var tableToExcel = (function() {
  return function(table, name) {
    if (!table.nodeType) table = document.getElementById(table)
    //window.location.href = 'http://makruvatech.com/in.php?filename='+ name +'&data=' + table.innerHTML
    window.location.href = 'http://localhost/exp/in.php?f='+ name +'&d=' + table.innerHTML
  }
})()