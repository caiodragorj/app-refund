//####elementos do form
const form = document.querySelector("form") // o formulario
const amount = document.getElementById("amount") // input valor da despesa
const expense = document.getElementById("expense") //nome da despesa
const category = document.getElementById("category") //categoria

// ######elementos da lista
const expenseList = document.querySelector("ul")
const expenseQuanty = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")


//observando o input amount
amount.oninput = () => {
  let value = amount.value.replace(/\D/g,"")// recebe o valor e tira as letras

  //trasnforma o valor em centavos (exemplo: 150/100 = 1.5 que é equivalente a R$1,50, se digitar mais uma zero R$11,50 )
value = Number(value) / 100

 //atualiza o valor do inout
  amount.value = formatCurrencyBRL(value)
}

//formar numero para real brasil
function formatCurrencyBRL(value){
  value =value.toLocaleString("pt-BR",{
    style: "currency",
    currency: "BRL",
  })

  //retorna o valor formatado (executa função)
  return value
}

// captura o evento de submit pra pegar os valores
form.onsubmit = (event) =>{
  event.preventDefault() // naop recarrega a pagina no submit

  //cria o objeto com os detalhes da despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    create_at: new Date( )
  }
  //chama a função que ira adicionar o item na lista
  expenseAdd(newExpense)
}


function expenseAdd(newExpense){
  try {
   const expenseItem = document.createElement("li")// cria elemento da lista li
   expenseItem.classList.add("expense")
   // ###### cria o ICONE da categoria
   const expenseIcon = document.createElement("img") 
   expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
   expenseIcon.setAttribute("alt", newExpense.category_name)
   

  // ###### cria o INFO da despesa
  const expenseInfo = document.createElement("div")
  expenseInfo.classList.add("expense-info")
  
  // cria o nome da despesa
  const expenseName = document.createElement("strong")
  expenseName.textContent =newExpense.expense

    // cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent =newExpense.category_name

    // Adiciona o valor da despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`

    // adiciona nome e categoria na div info
    expenseInfo.append(expenseName, expenseCategory)

    // cria botao remover

    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")

   // adiciona infomrações no item, icone nome e ctaegoria e valor 
      expenseItem.append(expenseIcon,expenseInfo, expenseAmount, removeIcon)

  


     // adiciona o item pronto na lista
     expenseList.append(expenseItem)

     // limpa o formulario
     formClear()
     
      // Atializa totais
   updateTotal()   

  } catch (error) {
    alert("Não foi possivel atualizar a lista")
    console.log(error)
  }
}

//atualiza totais
function updateTotal(){
  try {
  // recupera todos os itens as LI 
    const items = expenseList.children
    console.log(items)
   //atualiza quantidade de desepsas
   expenseQuanty.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}` // se tiver mais que 1 despesa bota no plural
  // Variavel para incremnetar o TOTAL  
    let total  = 0
    //percorre cada LI
    for (let item = 0; item < items.length; item++) {
     const itemAmount = items[item].querySelector(".expense-amount") 
      
     // remove carcteres nao numericos e troca virgula por ponto
     let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace("," , ".")
    // converte valor para float
    value = parseFloat(value)  
    
    // verifica se e um numero valido
      if (isNaN(value)) {
       return alert("Não foi possivel calcular o total") 
      }
   // incrementar o valor total
      total += Number(value)
    }
// cria o span com o R$ do total
const symbolBrl = document.createElement("small")
symbolBrl.textContent = "R$"
// fomrata o valor e remove o R$ que vai via JS
total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

//limpa o conteudo do elemento
expenseTotal.innerHTML = ""
// adiciona symbolo da moeda e valor
expenseTotal.append(symbolBrl, total)


  } catch (error) {
    console.log(error)
    alert("Erro no total")
  }
}

//Evento que captura o clique nos items d alista
expenseList.addEventListener ("click", function (event) {
  // verifica se o elemento clicado é o icone de remover
  if (event.target.classList.contains("remove-icon")) {
    // obtem a LI pai do elemnto clicado
    const item = event.target.closest(".expense")

    //remove o itme
    item.remove()
  
  }
    // atualiza os totais
    updateTotal()
})

//limpar campos
function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""
// coloca foco no input de amount
  expense.focus()
}
