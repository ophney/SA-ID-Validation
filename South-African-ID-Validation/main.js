let idInput = document.querySelector('#verify_id');
const myForm = document.querySelector('#my-form');
const msg = document.querySelector('.msg');
const msgId = document.querySelector('.invalid-id');
const userList = document.querySelector('#users');
const clearButton = document.querySelector('#clear');

let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
localStorage.setItem('items', JSON.stringify(itemsArray));
const data = JSON.parse(localStorage.getItem('items'));

idInput.addEventListener('input', checkId);
myForm.addEventListener('submit', onSubmit);

// Event listener for input in ID text field. Displays green when true.
function checkId(e) {
    e.preventDefault();
    let ID = verify_id(idInput.value);
    if (ID.Valid === true){
        idInput.style.borderColor = 'green';
        msgId.innerHTML = '';
    } else {
        idInput.style.borderColor = 'red';
        msgId.innerHTML = 'Invalid South African ID';
    }
}

// Validate the South African ID number: returns{Valid,Gender,Citizenship,} 
function verify_id(num) {
    //Equation to verify.
    if (isNaN(num) || num === '' || num.length !== 13 || num.substring(2,4) === '00' || num.substring(4,6) === '00') 
    {
        return false;
    }
    let step1 = 0;
    let step2 = '';
    let step4 = 0;
    let i;
    for (i = 1; i < 14; i++) {
        if (i%2!==0 && i<=11 ){
            step1+=parseInt(num[i-1]);
        }
        else if (i<=12) {
            step2 += String(num[i - 1]);
        }
    }
    const step3 = String(parseInt(step2) * 2);
    let j;
    for (j = 0; j < step3.length; j++) {
        step4+=parseInt(step3[j]);
    }
    const step5 = String(step1+step4);
    const step6 = 10-parseInt(step5[step5.length-1]);
    
    //Gender & Citizenship
    const gender = (parseInt(num.substring(6, 10)) < 5000) ? "Female" : "Male";
    const citizenship = (parseInt(num.substring(10, 11)) === 0) ? "South Africa" : "None South African";

    //Valid: returns true
    return {Valid:num[num.length - 1] === String(step6),Gender:gender,Citizen:citizenship
    };
}

// Event listener on submit. checks id valid then returns values as li element.
function onSubmit(e) {
    e.preventDefault();
    let ID = verify_id(idInput.value);
    if (!ID.Valid) {
        msg.innerHTML = 'Your ID number is not valid';
        setTimeout(function () {
            msg.innerHTML = '';
        },3000);
    } else {
        //Adds data to an array and creates a li item.
        itemsArray.push(`${idInput.value} | ${ID.Gender} | ${ID.Citizen}`);
        localStorage.setItem('items', JSON.stringify(itemsArray));
        liMaker(`ID Number: ${idInput.value} | Gender: ${ID.Gender} | Citizenship: ${ID.Citizen}`);
        idInput.value = '';
    }
}

// Function to create a li element.
const liMaker = text => {
  const li = document.createElement('li');
  li.textContent = text;
  userList.appendChild(li)
};

// Creates li for each submit
data.forEach(item => {
  liMaker(item)
});

// Clears localStorage of all submissions
clearButton.addEventListener('click', function() {
  localStorage.clear();
  while (userList.firstChild) {
    userList.removeChild(userList.firstChild)
  }
});
