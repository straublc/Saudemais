export default function ehUmCNPJ(campo) {
  const cnpj = campo.value.replace(/\.|\/|-/g, "");
  
  if (validaNumerosRepetidos(cnpj) || 
      validaPrimeiroDigito(cnpj) || 
      validaSegundoDigito(cnpj)) {
      campo.setCustomValidity('Esse CNPJ não é válido');
  }
}

function validaNumerosRepetidos(cnpj) {
  const numerosRepetidos = [
      '00000000000000',
      '11111111111111',
      '22222222222222',
      '33333333333333',
      '44444444444444',
      '55555555555555',
      '66666666666666',
      '77777777777777',
      '88888888888888',
      '99999999999999'
  ];

  return numerosRepetidos.includes(cnpj);
}

function validaPrimeiroDigito(cnpj) {
  let soma = 0;
  let multiplicador = 5;
  const digitos = cnpj.substring(0, 12);

  for (let i = 0; i < 12; i++) {
      soma += digitos[i] * multiplicador;
      multiplicador = (multiplicador === 2) ? 9 : multiplicador - 1;
  }

  const resto = soma % 11;
  const digitoVerificador = resto < 2 ? 0 : 11 - resto;

  return digitoVerificador != cnpj[12];
}

function validaSegundoDigito(cnpj) {
  let soma = 0;
  let multiplicador = 6;
  const digitos = cnpj.substring(0, 13);

  for (let i = 0; i < 13; i++) {
      soma += digitos[i] * multiplicador;
      multiplicador = (multiplicador === 2) ? 9 : multiplicador - 1;
  }

  const resto = soma % 11;
  const digitoVerificador = resto < 2 ? 0 : 11 - resto;

  return digitoVerificador != cnpj[13];
}