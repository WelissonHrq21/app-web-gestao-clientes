import axios from 'https://cdn.skypack.dev/axios';

const InputUser = document.querySelector('#input-user');
const inputPassword = document.querySelector('#input-password');
const formLogin = document.querySelector('#form-login');

const ctnLogin = document.querySelector('#bgd-container');
const ctnInsert = document.querySelector('#section-app');

const ctnFormInsert = document.querySelector('#container-form-insert');

const insertForm = document.querySelector('#insert-customer-form');
const inputName = document.querySelector('#input-name');
const inputEmail = document.querySelector('#input-email');
const inputTel = document.querySelector('#input-tel');

const seeAllBtn = document.querySelector('#see-all-btn');
const seeAllCtn = document.querySelector('#see-all-container');
const closeCtnBtn = document.querySelector('#close-ctn-btn');

const customerDataCtn = document.querySelector('#customer-data-ctn');

const formSearch = document.querySelector('#form-search');
const inputSearch = document.querySelector('#input-search');

const serverURL = 'https://api-gestao-de-clientes-node-js.onrender.com'

const LoginUser = async () => {
    const userData = {
        username: InputUser.value,
        password: inputPassword.value
    };


    await axios.post(`${serverURL}/auth/login`, userData)
        .then((response) => {
            console.log(response.data.message);

            sessionStorage.setItem('userToken', response.data.token);

            ctnLogin.style.display = 'none';
            ctnInsert.style.display = 'flex';
        }).catch((err) => {
            console.log('Ocorreu um erro', err.response.data.message);
            alert(err.response.data.message);
        });


};

const updateCustomerListUI = async () => {
    customerDataCtn.innerHTML = '';
    await ListAllCustomers();
};

const ListAllCustomers = async () => {
    await axios.get(`${serverURL}/customers`)
        .then((response) => {
            console.log(response);
            const data = response.data;

            data.forEach(item => {
                customerDataCtn.innerHTML += `<div class="ctn-customer">
                    <div class="customer-data">
                        <h3>Id: ${item._id}</h3>
                        <p>Nome: ${item.nome}</p>
                        <p class="email-p">Email: ${item.email}</p>
                        <p>Telefone: ${item.telefone}</p>
                    </div>
                    <div class="buttons">
                        <button data-customer-id="${item._id}" class="remove-btn">Remover</button>
                    </div>
                </div>`
            });


        }).catch((err) => {
            console.log('Ocorreu um erro', err);
        })
};

document.addEventListener('click', function (e) {
    if (e.target && e.target.className == 'remove-btn') {
        const customerId = e.target.getAttribute('data-customer-id');
        RemoveCustomer(customerId);
    }
});

const insertCustomer = async () => {
    const customerData = {
        nome: inputName.value,
        email: inputEmail.value,
        telefone: inputTel.value
    }

    await axios.post(`${serverURL}/customers`, customerData)
        .then((response) => {
            console.log(`Cliente cadastrado, Id gerado: ${response.data._id}`);
            alert(`Cliente cadastrado com o ID: ${response.data._id}`);
            updateCustomerListUI();
        }).catch((err) => {
            console.log('Ocorreu um erro', err);
        });
};

const ListCustomerById = async (id) => {

    await axios.get(`${serverURL}/customers/${id}`)
        .then((response) => {
            console.log(response);
            const data = response.data;
            customerDataCtn.innerHTML = '';
            customerDataCtn.innerHTML = `<div class="ctn-customer">
        <div class="customer-data">
            <h3>Id: ${data._id}</h3>
            <p>Nome: ${data.nome}</p>
            <p class="email-p">Email: ${data.email}</p>
            <p>Telefone: ${data.telefone}</p>
        </div>
        <div class="buttons">
            <button data-customer-id="${data._id}" class="remove-btn">Remover</button>
        </div>
    </div>`


        }).catch((err) => {
            console.log(err.response.data.message);
        });

};

const RemoveCustomer = async (id) => {
    const userId = id;

    await axios.delete(`${serverURL}/customers/${id}`)
        .then((response) => {
            console.log(response.message);
            updateCustomerListUI();
        }).catch((err) => {
            console.log('Ocorreu um erro', err);
        });

};

formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    ListCustomerById(inputSearch.value);
    inputSearch.value = '';
});


formLogin.addEventListener('submit', (e) => {
    e.preventDefault();


    LoginUser();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('userToken');



    InputUser.value = '';
    inputPassword.value = '';
});

insertForm.addEventListener('submit', (e) => {
    e.preventDefault();

    insertCustomer();
    inputName.value = '';
    inputEmail.value = '';
    inputTel.value = '';

});

seeAllBtn.addEventListener('click', () => {

    ctnFormInsert.style.display = 'none';
    seeAllCtn.style.display = 'flex';

    updateCustomerListUI();



});

closeCtnBtn.addEventListener('click', () => {
    seeAllCtn.style.display = 'none';
    ctnFormInsert.style.display = 'flex';
});