document.addEventListener("DOMContentLoaded", () => {
  const cidrSelect = document.getElementById("cidr");
  for (let i = 1; i <= 30; i++) {
    const mask = cidrParaDecimal(i);
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `/${i} - ${mask}`;
    cidrSelect.appendChild(option);
  }
});

function calcular() {
  const ip = document.getElementById("ip").value.trim();
  const cidr = parseInt(document.getElementById("cidr").value);

  if (!validarIP(ip)) {
    alert("Endereço IP inválido!");
    return;
  }

  const ipBin = ipParaBinario(ip);
  const maskBin = "1".repeat(cidr).padEnd(32, "0");
  const wildcardBin = "0".repeat(cidr).padEnd(32, "1");

  const netBin = andBinario(ipBin, maskBin);
  const broadcastBin = orBinario(netBin, wildcardBin);

  const rede = binarioParaIP(netBin);
  const broadcast = binarioParaIP(broadcastBin);
  const minHost = cidr === 32 ? "N/A" : binarioParaIP(incrementaBin(netBin));
  const maxHost = cidr >= 31 ? "N/A" : binarioParaIP(decrementaBin(broadcastBin));
  const numHosts = cidr >= 31 ? 0 : Math.pow(2, 32 - cidr) - 2;

  const wildcard = cidrParaWildcard(cidr);
  const mascara = cidrParaDecimal(cidr);

  document.getElementById("resultado").innerHTML = `
    <strong>Endereço de Rede:</strong> ${rede}<br>
    <strong>Broadcast:</strong> ${broadcast}<br>
    <strong>Host Mínimo:</strong> ${minHost}<br>
    <strong>Host Máximo:</strong> ${maxHost}<br>
    <strong>Total de Hosts válidos:</strong> ${numHosts}<br>
    <strong>Máscara Decimal:</strong> ${mascara}<br>
    <strong>Máscara CIDR:</strong> /${cidr}<br>
    <strong>Wildcard:</strong> ${wildcard}
  `;
}

// Utilitários

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

function ipParaBinario(ip) {
  return ip.split('.')
    .map(oct => parseInt(oct).toString(2).padStart(8, "0"))
    .join('');
}

function binarioParaIP(bin) {
  return bin.match(/.{1,8}/g).map(b => parseInt(b, 2)).join('.');
}

function andBinario(a, b) {
  return a.split('').map((bit, i) => bit & b[i]).join('');
}

function orBinario(a, b) {
  return a.split('').map((bit, i) => bit | b[i]).join('');
}

function incrementaBin(bin) {
  return (BigInt('0b' + bin) + 1n).toString(2).padStart(32, '0');
}

function decrementaBin(bin) {
  return (BigInt('0b' + bin) - 1n).toString(2).padStart(32, '0');
}

function cidrParaDecimal(cidr) {
  return Array(4).fill(0).map((_, i) => {
    const bits = Math.min(8, Math.max(0, cidr - i * 8));
    return parseInt("1".repeat(bits).padEnd(8, "0"), 2);
  }).join('.');
}

function cidrParaWildcard(cidr) {
  return cidrParaDecimal(cidr).split('.').map(o => 255 - o).join('.');
}

// Alternância de tema (claro/escuro)
const toggleBtn = document.getElementById("toggle-theme");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggleBtn.textContent = document.body.classList.contains("light") ? "🌙 Modo Escuro" : "🌞 Modo Claro";
});
