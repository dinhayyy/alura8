document.getElementById('btn-analisar').addEventListener('click', processarMensagem);

function processarMensagem() {
    const textoMensagem = document.getElementById('input-mensagem').value.trim();
    const painelResultado = document.getElementById('resultado-analise');

    if (!textoMensagem) {
        alert("Por favor, digite ou cole uma mensagem para realizar a análise.");
        return;
    }

    // REGEX & MATRIZES DE SINAIS DE GOLPE
    const contemLink = /https?:\/\/[^\s]+/i.test(textoMensagem);
    
    // Gatilhos comuns de urgência e engenharia social
    const gatilhosFraude = [
        "bloqueada", "urgente", "clique aqui", "regularize", "atualize seu cadastro", 
        "vencimento hoje", "sua conta", "ganhou", "sorteio", "será cancelado"
    ];

    // Varredura de palavras-chave
    let palavrasDetectadas = [];
    gatilhosFraude.forEach(termo => {
        if (textoMensagem.toLowerCase().includes(termo)) {
            palavrasDetectadas.push(termo);
        }
    });

    // AVALIAÇÃO DO GRAU DE RISCO
    painelResultado.classList.remove('invisible', 'danger', 'safe');
    
    let htmlResultado = "";

    // Se contiver link E palavras de coerção/urgência, classifica como Alto Risco
    if (contemLink && palavrasDetectadas.length >= 1) {
        painelResultado.classList.add('danger');
        htmlResultado = `
            <h3 style="color: #ef4444; margin-top:0;">⚠️ Alerta de Alto Risco Encontrado</h3>
            <p><strong>Padrão de Golpe Detectado:</strong> Esta mensagem apresenta as características cruciais de um ataque de engenharia social.</p>
            <ul>
                <li><strong>Link Identificado:</strong> O texto possui links externos acoplados à mensagem.</li>
                <li><strong>Gatilhos Psicológicos:</strong> Foram encontradas as seguintes expressões suspeitas: <em>"${palavrasDetectadas.join(', ')}"</em>.</li>
            </ul>
            <p><strong>Recomendação do Sistema:</strong> Não clique no link e não forneça tokens ou senhas.</p>
        `;
    } else {
        painelResultado.classList.add('safe');
        htmlResultado = `
            <h3 style="color: #22c55e; margin-top:0;">✅ Nenhum Padrão Crítico Detectado</h3>
            <p>A mensagem não acionou os filtros automáticos de links maliciosos combinados com urgência coercitiva.</p>
            <p><small>Nota: Mantenha-se sempre vigilante, novos formatos de fraudes surgem diariamente.</small></p>
        `;
    }

    painelResultado.innerHTML = htmlResultado;
}
