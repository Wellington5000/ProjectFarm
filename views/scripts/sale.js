  var socket = io('http://phamacy-project.herokuapp.com')
  totalValue = 0
  dataAll = null
  medicineAdd = []
  amountAll = []

  socket.on('receivedData', (data, result) => {
    if(result){
      document.getElementById('name-medicine').value = data.name_medicine
      document.getElementById('description').value = data.description
      document.getElementById('lote').value = data.lote
      document.getElementById('amount').value = 1
      document.getElementById('price').value = data.sale_value
      var img = document.createElement("img");
      img.id = "img" 
      img.src = '/' + data.image_name
      var src = document.getElementById("image-medicine")
      src.appendChild(img)
      dataAll = data
    } 
    else {
      var img = document.createElement("img");
      img.id = "img"
      var src = document.getElementById("image-medicine")
      src.appendChild(img)

      document.getElementById('name-medicine').value = ""
      document.getElementById('description').value = ""
      document.getElementById('lote').value = ""
      document.getElementById('amount').value = ""
      document.getElementById('price').value = ""

      alert('Medicine not found')
    }
  })

  function search(){
    document.getElementById("img").remove()
    var researcherData = {userId: document.getElementById('userId').innerHTML, medicine: document.getElementById('searcher').value}
    socket.emit('sendSearch', researcherData)
  }

  $(document).keypress(function(e) {
    if (e.which == 13) {
      search()
    }
  })

  count = 0  
  function add(){
    var list = document.getElementById('list').innerHTML
    
    var price = document.getElementById('price').value
    var amount = document.getElementById('amount').value
    amountAll.push(amount)
    var name_medicine = document.getElementById('name-medicine').value
    
    if(name_medicine){
      medicineAdd.push(dataAll)
      medicineAdd[count].acquired_value = dataAll.acquired_value
      medicineAdd[count].amount = amount
      medicineAdd[count].sale_value = price
      list = list + "<li id='" + count + "'>" + "<strong>" + name_medicine + "</strong>" + '  -  Quantidade: ' + amount  + '  - Preço: ' + price + " " + "<a  id='" + count + "' onclick='remove(id)' href='#'>" + "<svg class='bi bi-trash' width='1.2em' height='1.2em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/>" + "<path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/>" + "</svg>" + "</a>" +"</li>"

      document.getElementById("list").innerHTML = list;
      
      totalValue = totalValue + parseInt(price)
      document.getElementById('total-value').value = totalValue

      document.getElementById('searcher').value = ""
      document.getElementById('name-medicine').value = ""
      document.getElementById('description').value = ""
      document.getElementById('lote').value = ""
      document.getElementById('amount').value = ""
      document.getElementById('price').value = ""
      count++
    }
  }

  function changedAmount(){
    var price = 0
    var amount = document.getElementById('amount').value
    price = amount * dataAll.sale_value
    document.getElementById('price').value = price
  }

  function remove(id){
    document.getElementById(id).remove()
    medicineAdd[id] = null
    totalValue = 0
    
    for(let i = 0; i < medicineAdd.length; i++){
      if(medicineAdd[i] != null){
        price = medicineAdd[i].sale_value * amountAll[i]
        totalValue = totalValue + price
      }
    }
    document.getElementById('total-value').value = totalValue
  }

  function checkout(){
    socket.emit('saveSale', medicineAdd)
    totalValue = 0
    document.getElementById('total-value').value = ''
    document.getElementById('list').innerHTML = ''
    medicineAdd.splice(0, medicineAdd.length - 1)
    
  }

  socket.on('status', (status, msg) => {
    if(status){
      alert(msg)
    }
    else{
      alert("Erro ao salvar " + msg + " Contate o desenvolvedor")
    }
  })