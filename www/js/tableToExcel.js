var tableToExcel = (function() {
  return function(table, name) {
    if (!table.nodeType) table = document.getElementById(table)
    window.location.href = 'http://digital.makruvatech.com/in.php?f='+ name +'&d=' + table.innerHTML
    //window.location.href = 'http://localhost/exp/in.php?f='+ name +'&d=' + table.innerHTML
  }
})()