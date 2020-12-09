const socket = io('http://phamacy-project.herokuapp.com')

var table = document.getElementById('table')
var combo = document.getElementById('combo-box')
var userId = document.getElementById('userId').innerHTML

//Exibe os campos do combobox selecionado
function comboSelected(){
  var selectedElement = combo.selectedIndex
  switch (selectedElement){
    case 0:
      //Remove todas as linhas da tabela
      if(table.rows.length > 0){
        for(let i = table.rows.length - 1; i > 0; i--){
          table.deleteRow(i)
        }
      }

      document.getElementById('filter-bar-code').hidden = true
      document.getElementById('filter-name').hidden = true
      document.getElementById('filter-date').hidden = true

      socket.emit('searchReport', 3, null, userId)

    case 1:
      document.getElementById('filter-bar-code').hidden = false
      document.getElementById('filter-name').hidden = true
      document.getElementById('filter-date').hidden = true
      break

    case 2:
      document.getElementById('filter-name').hidden = false
      document.getElementById('filter-bar-code').hidden = true
      document.getElementById('filter-date').hidden = true
      break

    case 3:
      document.getElementById('filter-date').hidden = false
      document.getElementById('filter-bar-code').hidden = true
      document.getElementById('filter-name').hidden = true
      break

    case 4:
      //Remove todas as linhas da tabela
      if(table.rows.length > 0){
        for(let i = table.rows.length - 1; i > 0; i--){
          table.deleteRow(i)
        }
      }

      document.getElementById('filter-bar-code').hidden = true
      document.getElementById('filter-name').hidden = true
      document.getElementById('filter-date').hidden = true

      socket.emit('searchReport', 4, null, userId)
      break

    case 5:
      //Remove todas as linhas da tabela
      if(table.rows.length > 0){
        for(let i = table.rows.length - 1; i > 0; i--){
          table.deleteRow(i)
        }
      }

      document.getElementById('filter-bar-code').hidden = true
      document.getElementById('filter-name').hidden = true
      document.getElementById('filter-date').hidden = true
      
      socket.emit('searchReport', 5, null, userId)
  }
}

comboSelected()

function search(){
  var selectedElement = combo.selectedIndex

  //Apaga todas as linhas anteriores da tabela
  if(table.rows.length > 0){
    for(let i = table.rows.length - 1; i > 0; i--){
      table.deleteRow(i)
    }
  }
  selectedElement = selectedElement - 1
  switch (selectedElement){
    case 0:
      var code = document.getElementById('field-bar-code').value
      socket.emit('searchReport', selectedElement, code, userId)
      break

    case 1:
      var name = document.getElementById('field-name').value
      socket.emit('searchReport', selectedElement, name, userId)
      break
    
    case 2:
      var date1 = document.getElementById('field-date1').value
      var date2 = document.getElementById('field-date2').value
      var date = {date1, date2}
      socket.emit('searchReport', selectedElement, date, userId)
      break
  }
}

socket.on('resultSearch', (result) => {
  var totalValue = 0
  var netValue = 0
  var amount = 0
  var percent = 0
  var row, field1, field2, field3, field4, field5, text1, text2, text3, text4, text5, date
  for(let i = 0; i < result.length; i++){
    //Calcula o valor total
    totalValue = result[i].price + totalValue
    //Calcula o valor líquido
    netValue = netValue + (result[i].acquired_value * result[i].amount)
    //Calcula a quantidade vendida
    amount = result[i].amount + amount
    date = new Date(result[i].date)

    //Cria as linhas e os campos da tabela
    row = document.createElement('tr')
    field1 = document.createElement('td')
    field2 = document.createElement('td')
    field3 = document.createElement('td')
    field4 = document.createElement('td')
    field5 = document.createElement('td')

    //cria o texto em cada campo
    text1 = document.createTextNode(result[i].bar_code);
    text2 = document.createTextNode(result[i].name_medicine);
    text3 = document.createTextNode(result[i].amount);
    text4 = document.createTextNode(result[i].price);
    text5 = document.createTextNode(date.toLocaleDateString());

    //Insere o texto em cada campo
    field1.appendChild(text1)
    field2.appendChild(text2)
    field3.appendChild(text3)
    field4.appendChild(text4)
    field5.appendChild(text5)

    //Junta os campos na linha
    row.appendChild(field1)
    row.appendChild(field2)
    row.appendChild(field3)
    row.appendChild(field4)
    row.appendChild(field5)

    //Insere na tabela
    table.appendChild(row)
  }

  percent = 100 - (netValue * 100 / totalValue)
  percent = percent.toFixed(1) + '%'
  
  document.getElementById('info1').innerHTML = amount
  document.getElementById('info2').innerHTML = totalValue
  document.getElementById('info3').innerHTML = totalValue - netValue
  document.getElementById('info4').innerHTML = percent
})
