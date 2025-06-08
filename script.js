function validarIP(ip) {
  const partes = ip.split('.');
  if (partes.length !== 4) return false;
  for (let parte of partes) {
    if (!/^\d+$/.test(parte)) return false;
    const num = Number(parte);
    if (num < 0 || num > 255) return false;
  }
  return true;
}

function cidrParaMascaraDecimal(cidr) {
  const bits = '1'.repeat(cidr).padEnd(32, '0');
  const mascara = [];
  for (let i = 0; i < 4; i++) {
    mascara.push(parseInt(bits.slice(i * 8, (i + 1) * 8), 2));
  }
  return mascara;
}

function calcularSubrede(ip, mascaraCidr) {
  const ipParts = ip.split('.').map(Number);
  const cidr = parseInt(mascaraCidr);
  const mascara = cidrParaMascaraDecimal(cidr);
  const wildcard = mascara.map(oct => 255 - oct);
  const ipBin = ipParts.map((part, i) => part & mascara[i]);
  const rede = ipBin;
  const broadcast = ipBin.map((part, i) => part | wildcard[i]);

  const totalHosts = cidr < 31 ? Math.pow(2, 32 - cidr) - 2 : (cidr === 31 ? 2 : 1);

  const hostMin = [...rede];
  const hostMax = [...broadcast];
  if (cidr < 31) {
    hostMin[3] += 1;
    hostMax[3] -= 1;
  }

  return {
    enderecoRede: rede.join('.'),
    broadcast: broadcast.join('.'),
    hostMin: hostMin.join('.'),
    hostMax: hostMax.join('.'),
    totalHosts: totalHosts,
    mascaraDecimal: mascara.join('.'),
    mascaraCIDR: `/${cidr}`,
    wildcard: wildcard.join('.')
  };
}

document.getElementById("subnet-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const ip = document.getElementById("ip").value.trim();
  const cidr = document.getElementById("cidr").value;

  if (!validarIP(ip)) {
    alert("Endereço IP inválido.");
    return;
  }

  const resultado = calcularSubrede(ip, cidr);

  document.getElementById("rede").textContent = resultado.enderecoRede;
  document.getElementById("broadcast").textContent = resultado.broadcast;
  document.getElementById("hostMin").textContent = resultado.hostMin;
  document.getElementById("hostMax").textContent = resultado.hostMax;
  document.getElementById("totalHosts").textContent = resultado.totalHosts;
  document.getElementById("mascaraDecimal").textContent = resultado.mascaraDecimal;
  document.getElementById("mascaraCIDR").textContent = resultado.mascaraCIDR;
  document.getElementById("wildcard").textContent = resultado.wildcard;

  document.getElementById("resultado").classList.remove("hidden");
});
