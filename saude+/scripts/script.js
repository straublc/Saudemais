import ehUmCPF from "./validador-cpf.js";

const camposDoFormulario = document.querySelectorAll('[required]');
const formulario = document.querySelector('[data-form]');

formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const listaRespostas = {
        "nome": e.target.elements["nome"].value,
        "cpf": e.target.elements["cpf"].value,
        "email": e.target.elements["email"].value,
        "celular": e.target.elements["celular"].value,
        "aniversario": e.target.elements["data"].value,
        "estado": e.target.elements["estado"].value,
    };

    localStorage.setItem("cadastro", JSON.stringify(listaRespostas));
    window.location.href = "./abrir-conta-form-2.html";
});

const campoNome = document.getElementById("nome");
campoNome.addEventListener("input", () => {
campoNome.value = campoNome.value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
});

document.querySelectorAll('input[inputmode="numeric"]').forEach((input) => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, ""); 
    });
});

camposDoFormulario.forEach((campo) => {
    campo.addEventListener("blur", () => verificaCampo(campo));
    campo.addEventListener("invalid", evento => evento.preventDefault());
});

const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'tooShort',
    'customError'
];

const mensagens = {
    nome: {
        valueMissing: "O campo de nome não pode estar vazio.",
        patternMismatch: "Por favor, preencha um nome válido, apenas letras.",
        tooShort: "Por favor, preencha um nome válido."
    },
    email: {
        valueMissing: "O campo de e-mail não pode estar vazio.",
        typeMismatch: "Por favor, preencha um email válido.",
        tooShort: "Por favor, preencha um email válido."
    },
    rg: {
        valueMissing: "O campo de RG não pode estar vazio.",
        patternMismatch: "Por favor, preencha um RG válido.",
        tooShort: "O campo de RG não tem caracteres suficientes."
    },
    cpf: {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        patternMismatch: "Por favor, preencha um CPF válido.",
        customError: "O CPF digitado não existe.",
        tooShort: "O campo de CPF não tem caracteres suficientes."
    },
    data: {
        valueMissing: 'O campo de data de nascimento não pode estar vazio.',
        customError: 'Você deve ser maior que 18 anos para se cadastrar.'
    },
    celular: {
        valueMissing: "O campo de celular não pode estar vazio.",
        patternMismatch: "Por favor, preencha um número de celular válido.",
        tooShort: "O campo de celular não tem caracteres suficientes."
    },
    estado: {
        valueMissing: "Selecione um estado."
    }
};

function verificaCampo(campo) {
    let mensagem = "";
    campo.setCustomValidity('');

    if (campo.name === "nome" && campo.value.trim() !== "") {
        const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/;
        if (!nomeRegex.test(campo.value)) {
            mensagem = mensagens[campo.name].patternMismatch;
        }
    }

    if (campo.name === "cpf" && campo.value.length >= 11) {
        ehUmCPF(campo);
    }

    if (campo.name === "data" && campo.value !== "") {
        ehMaiorDeIdade(campo);
    }

    tiposDeErro.forEach(erro => {
        if (campo.validity[erro]) {
            mensagem = mensagens[campo.name][erro];
        }
    });

    const mensagemErro = campo.parentNode.querySelector('.mensagem-erro');
    const validadorDeInput = campo.checkValidity();

    if (!validadorDeInput || mensagem) {
        mensagemErro.textContent = mensagem;
    } else {
        mensagemErro.textContent = "";
    }
}
