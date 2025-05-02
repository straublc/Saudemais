import ehUmCPF from "./validador-cpf.js";
import ehMaiorDeIdade from "./validaIdade.js";
import ehUmCNPJ from "./validador-cnpj.js";

const camposDoFormulario = document.querySelectorAll('[required]');
const formulario = document.querySelector('[data-form]');
const inputCPF = document.getElementById('cpf');
const inputCelular = document.getElementById('celular');
const inputCNPJ = document.getElementById('cnpj');
const inputTelefone = document.getElementById('telefone');

function aplicarMascaraCPF(cpf) {
    return cpf.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function aplicarMascaraCelular(celular) {
    return celular.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{4})$/, '$1-$2');
}

function aplicarMascaraTelefone(telefone) {
    return telefone.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{4})$/, '$1-$2');
}

function aplicarMascaraCNPJ(cnpj) {
    return cnpj.replace(/\D/g, '')
               .replace(/^(\d{2})(\d)/, '$1.$2')
               .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
               .replace(/\.(\d{3})(\d)/, '.$1/$2')
               .replace(/(\d{4})(\d)/, '$1-$2')
               .substring(0, 18);
}

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const listaRespostas = {
        "razaoSocial": e.target.elements["razaoSocial"].value,
        "cnpj": e.target.elements["cnpj"].value,
        "endereco": e.target.elements["endereco"].value,
        "numFuncionarios": e.target.elements["numFuncionarios"].value,
        "tipoPlano": e.target.elements["tipoPlano"].value,
        "nome": e.target.elements["nome"].value,
        "email": e.target.elements["email"].value,
        "telefone": e.target.elements["telefone"].value
    };
    localStorage.setItem("cadastro", JSON.stringify(listaRespostas));
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
    'customError',
    'rangeUnderflow'
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
        tooShort: "O celular deve ter exatamente 11 dígitos (XX) XXXXX-XXXX.",
        customError: "O celular deve ter 11 dígitos."
    },
    estado: {
        valueMissing: "Selecione um estado."
    },
    razaoSocial: {
        valueMissing: "O campo Razão Social não pode estar vazio."
    },
    cnpj: {
        valueMissing: 'O campo de CNPJ não pode estar vazio.',
        patternMismatch: "Por favor, preencha um CNPJ válido.",
        customError: "O CNPJ digitado não é válido.",
        tooShort: "O CNPJ deve ter 14 dígitos."
    },
    endereco: {
        valueMissing: "O campo Endereço não pode estar vazio."
    },
    numFuncionarios: {
        valueMissing: "Informe o número de funcionários.",
        rangeUnderflow: "Deve ter pelo menos 1 funcionário."
    },
    tipoPlano: {
        valueMissing: "Selecione o tipo de plano."
    },
    telefone: {
        valueMissing: "O campo de telefone não pode estar vazio.",
        patternMismatch: "Por favor, preencha um número de telefone válido.",
        tooShort: "O telefone deve ter exatamente 10 dígitos (XX) XXXX-XXXX.",
        customError: "O telefone deve ter 10 dígitos."
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
    
    if (campo.name === "cpf") {
        if (campo.value.length < 14) {
            campo.setCustomValidity(mensagens.cpf.tooShort);
        } else {
            ehUmCPF(campo);
        }
    }
    
    if (campo.name === "data" && campo.value !== "") {
        ehMaiorDeIdade(campo);
    }
    
    if (campo.name === "celular") {
        const celularLimpo = campo.value.replace(/\D/g, '');
        if (celularLimpo.length !== 11) {
            campo.setCustomValidity(mensagens.celular.customError);
            mensagem = mensagens.celular.tooShort;
        }
    }

    if (campo.name === "estado" && campo.value === "") {
        mensagem = mensagens.estado.valueMissing;
    }

    if (campo.name === "cnpj") {
        if (campo.value.length < 18) {
            campo.setCustomValidity(mensagens.cnpj.tooShort);
        } else {
            ehUmCNPJ(campo);
        }
    }
    
    if (campo.name === "telefone") {
        const telefoneLimpo = campo.value.replace(/\D/g, '');
        if (telefoneLimpo.length !== 10) {
            campo.setCustomValidity(mensagens.telefone.customError);
            mensagem = mensagens.telefone.tooShort;
        }
    }

    if (campo.name === "razaoSocial" && campo.value.trim() === "") {
        mensagem = mensagens.razaoSocial.valueMissing;
    }
    
    if (campo.name === "endereco" && campo.value.trim() === "") {
        mensagem = mensagens.endereco.valueMissing;
    }
    
    if (campo.name === "numFuncionarios") {
        if (campo.value === "") {
            mensagem = mensagens.numFuncionarios.valueMissing;
        } else if (parseInt(campo.value) < 1) {
            mensagem = mensagens.numFuncionarios.rangeUnderflow;
        }
    }
    
    if (campo.name === "tipoPlano" && campo.value === "") {
        mensagem = mensagens.tipoPlano.valueMissing;
    }
    
    tiposDeErro.forEach(erro => {
        if (campo.validity[erro]) {
            mensagem = mensagens[campo.name][erro];
        }
    });

    const selectEstado = document.getElementById('estado');
    if (selectEstado) {
    selectEstado.addEventListener('change', function() {
        verificaCampo(selectEstado);
    });
}
    
    const mensagemErro = campo.parentNode.querySelector('.mensagem-erro');
    const validadorDeInput = campo.checkValidity();
    if (!validadorDeInput || mensagem) {
        mensagemErro.textContent = mensagem;
    } else {
        mensagemErro.textContent = "";
    }
}

if (inputCPF) {
    inputCPF.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 11) valor = valor.slice(0, 11);
        e.target.value = aplicarMascaraCPF(valor);
        
        if (valor.length < 11) {
            e.target.setCustomValidity(mensagens.cpf.tooShort);
        } else {
            e.target.setCustomValidity('');
        }
    });
}

if (inputCelular) {
    inputCelular.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 11) valor = valor.slice(0, 11);
        e.target.value = aplicarMascaraCelular(valor);
        
        if (valor.length < 11) {
            e.target.setCustomValidity(mensagens.celular.customError);
        } else {
            e.target.setCustomValidity('');
        }
    });
}

if (inputCNPJ) {
    inputCNPJ.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 14) valor = valor.slice(0, 14);
        e.target.value = aplicarMascaraCNPJ(valor);
        
        if (valor.length < 14) {
            e.target.setCustomValidity(mensagens.cnpj.tooShort);
        } else {
            e.target.setCustomValidity('');
        }
    });
}    

if (inputTelefone) {
    inputTelefone.addEventListener('input', function(e) {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 10) valor = valor.slice(0, 10);
        e.target.value = aplicarMascaraTelefone(valor);
        
        if (valor.length < 10) {
            e.target.setCustomValidity(mensagens.telefone.customError);
        } else {
            e.target.setCustomValidity('');
        }
    });
}

const selectPlano = document.getElementById('tipoPlano');
if (selectPlano) {
    selectPlano.addEventListener('change', function() {
        verificaCampo(selectPlano);
    });
}

document.querySelector('.btn-submit')?.addEventListener('click', function(e) {
    e.preventDefault();
    
    let formularioValido = true;
    camposDoFormulario.forEach(campo => {
        verificaCampo(campo);
        if (!campo.validity.valid) formularioValido = false;
    });

    if (formularioValido) {
      
        const formData = new FormData(formulario);
        const listaRespostas = Object.fromEntries(formData.entries());
        localStorage.setItem("cadastro", JSON.stringify(listaRespostas));
        
        window.location.href = 'desenvolvimento.html';
    }
});