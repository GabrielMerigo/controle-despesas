const transactionsUl = document.querySelector('#transactions');
const balanceDisplay = document.querySelector('#balance');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const form = document.querySelector('#form');
const textInput = document.querySelector('#text');
const amountInput = document.querySelector('#amount');


const localStorageTransactions = JSON.parse(localStorage
  .getItem(`transactions`));
let transactions = localStorage
  .getItem(`transactions`) !== null ? localStorageTransactions : [];

const removeTransaction = ID => {
  transactions = transactions
    .filter(transaction => transaction.id !== ID)
  updateLocalStorage();
  init();
} 

function addTransactionIntoDOM(transaction){
  const operator = transaction.amount < 0 ? '-' : '+';
  const CSSClass = transaction.amount < 0 ? 'minus' : 'plus';
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement('li');
  li.classList.add(CSSClass);

  li.innerHTML = `
  ${transaction.name}<span>${operator} R$ ${amountWithoutOperator}</span><button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
  `
  transactionsUl.prepend(li);

}

function updateBalanceValues(){
  const transactionsAmounts = transactions
    .map(transaction =>  transaction.amount);
  const total = transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)
  const income = transactionsAmounts
    .filter(number => number > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);
  const expense = Math.abs(transactionsAmounts
    .filter(number => number < 0)
    .reduce((accumulator, value) =>  accumulator + value ,0))
    .toFixed(2)
    
    balanceDisplay.innerHTML = `R$ ${total}`;
    incomeDisplay.innerHTML = `R$ ${income}`;
    expenseDisplay.innerHTML = `R$ ${expense}`;


}

function init(){
  transactionsUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
}

init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)


form.addEventListener('submit', event =>{
  event.preventDefault();

  const transactionName = textInput.value.trim();
  const transactionAmount = amountInput.value.trim();

  if(transactionName === '' || transactionAmount === ''){
    alert('Por favor, preencha os campos');
    return;
  }

  const transaction = {
    id: generateID(), 
    name: transactionName, 
    amount: Number(transactionAmount)
  };

  transactions.push(transaction);
  init();
  updateLocalStorage();

  transactionName.value = ''
  transactionAmount.value = ''
})