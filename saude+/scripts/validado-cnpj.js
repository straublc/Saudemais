// validador-cnpj.js

export function validarCNPJ(cnpj) {
    // Remover caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]+/g, '');
  
    // Verifica se o CNPJ tem 14 dígitos
    if (cnpj.length !== 14) {
      return false;
    }
  
    // Verifica se o CNPJ é uma sequência de números iguais, como 11111111111111
    if (/^(\d)\1{13}$/.test(cnpj)) {
      return false;
    }
  
    // Valida o primeiro dígito verificador
    let soma = 0;
    let posicao = 5;
    for (let i = 0; i < 12; i++) {
      soma += cnpj[i] * posicao--;
      if (posicao < 2) {
        posicao = 9;
      }
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 >= 10) digito1 = 0;
  
    // Valida o segundo dígito verificador
    soma = 0;
    posicao = 6;
    for (let i = 0; i < 13; i++) {
      soma += cnpj[i] * posicao--;
      if (posicao < 2) {
        posicao = 9;
      }
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 >= 10) digito2 = 0;
  
    // Verifica se os dígitos verificadores são válidos
    return cnpj[12] == digito1 && cnpj[13] == digito2;
}
