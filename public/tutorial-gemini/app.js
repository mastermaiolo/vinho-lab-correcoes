/**
 * TUTORIAL INTERATIVO DA API GOOGLE GEMINI
 * Controle de navegação, simulador e gerador de códigos.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // ESTADO GLOBAL DA APLICAÇÃO
  // ==========================================================================
  let currentStep = 1;
  const totalSteps = 5;
  
  // Estado do Simulador AI Studio
  let simState = {
    step: 1, // 1: Inicial (Get API key), 2: Modal Aberto, 3: Chave Gerada e Pronta
    keyGenerated: false,
    fakeKey: ''
  };

  // Estado do Gerador de Código
  let userKey = 'SUA_CHAVE_DE_API_GEMINI_AQUI';
  let activeLang = 'node';

  // Elementos do DOM - Navegação Geral
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const sectionSteps = document.querySelectorAll('.step-section');
  const navDots = document.querySelectorAll('.footer-dots .dot');
  const navItems = document.querySelectorAll('.step-nav-item');
  const progressBar = document.getElementById('nav-progress-bar');
  
  // Elementos do DOM - Simulador
  const simBtnCreateKeyTrigger = document.getElementById('sim-btn-create-key-trigger');
  const simModal = document.getElementById('sim-modal');
  const simBtnModalClose = document.getElementById('sim-btn-modal-close');
  const simBtnModalCancel = document.getElementById('sim-btn-modal-cancel');
  const simBtnModalCreate = document.getElementById('sim-btn-modal-create');
  const simEmptyState = document.getElementById('sim-empty-state');
  const simKeyRow = document.getElementById('sim-key-row');
  const simDisplayKey = document.getElementById('sim-display-key');
  const simBtnCopyKey = document.getElementById('sim-btn-copy-key');
  const simGuideBox = document.getElementById('sim-guide-box');
  const simGuideText = document.getElementById('sim-guide-text');
  
  // Elementos do DOM - Gerador de Código
  const inputApiKey = document.getElementById('user-api-key');
  const btnUseSimulated = document.getElementById('btn-use-simulated-key');
  const codeTabs = document.querySelectorAll('.code-tabs .tab-btn');
  const codeBlock = document.getElementById('code-block');
  const codeFilename = document.getElementById('code-filename');
  const btnCopySnippet = document.getElementById('btn-copy-snippet');
  const copyTextSpan = document.getElementById('copy-text');
  const setupNotes = document.getElementById('setup-notes');

  // ==========================================================================
  // NAVEGAÇÃO ENTRE ETAPAS (WIDGET SLIDES)
  // ==========================================================================
  
  function updateNavigationUI() {
    // 1. Atualizar visibilidade das seções
    sectionSteps.forEach((section, index) => {
      if (index + 1 === currentStep) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // 2. Atualizar Sidebar e Timeline
    navItems.forEach((item, index) => {
      const stepNum = index + 1;
      if (stepNum === currentStep) {
        item.classList.add('active');
        item.classList.remove('completed');
      } else if (stepNum < currentStep) {
        item.classList.add('completed');
        item.classList.remove('active');
      } else {
        item.classList.remove('active', 'completed');
      }
    });

    // Barra de progresso vertical/horizontal
    const fillPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressBar.style.height = window.innerWidth > 968 ? `${fillPercent}%` : '100%';
    progressBar.style.width = window.innerWidth <= 968 ? `${fillPercent}%` : '100%';

    // 3. Atualizar Dots do Footer
    navDots.forEach((dot, index) => {
      const stepNum = index + 1;
      if (stepNum === currentStep) {
        dot.classList.add('active');
      } else if (stepNum < currentStep) {
        dot.classList.add('completed');
        dot.classList.remove('active');
      } else {
        dot.classList.remove('active', 'completed');
      }
    });

    // 4. Habilitar/Desabilitar botões
    btnPrev.disabled = currentStep === 1;
    
    if (currentStep === totalSteps) {
      btnNext.innerHTML = `Concluir 
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    } else {
      btnNext.innerHTML = `Próximo 
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
    }
    
    // Rolar a tela para o topo do card no mobile
    if (window.innerWidth <= 640) {
      document.querySelector('.tutorial-card').scrollIntoView({ behavior: 'smooth' });
    }
  }

  function goToStep(step) {
    if (step >= 1 && step <= totalSteps) {
      currentStep = step;
      updateNavigationUI();
      
      // Se for o passo 5, atualizar os snippets
      if (currentStep === 5) {
        updateCodeSnippet();
      }
    }
  }

  // Listeners de navegação
  btnPrev.addEventListener('click', () => {
    goToStep(currentStep - 1);
  });

  btnNext.addEventListener('click', () => {
    if (currentStep === totalSteps) {
      // Finalização
      alert('Tutorial concluído! Agora você está pronto para integrar a API do Gemini no seu site com segurança.');
      goToStep(1);
    } else {
      // Validar se o usuário passou pelo simulador antes de prosseguir
      if (currentStep === 3 && !simState.keyGenerated) {
        if (!confirm('Recomendamos gerar sua chave de API no simulador antes de prosseguir. Deseja prosseguir mesmo assim?')) {
          return;
        }
      }
      goToStep(currentStep + 1);
    }
  });

  // Clicar nos itens da sidebar
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const step = parseInt(item.getAttribute('data-step'));
      goToStep(step);
    });
  });

  // Clicar nos dots do footer
  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const step = parseInt(dot.getAttribute('data-step'));
      goToStep(step);
    });
  });

  // Ajustar barra de progresso no redimensionamento da janela
  window.addEventListener('resize', () => {
    const fillPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    if (window.innerWidth > 968) {
      progressBar.style.height = `${fillPercent}%`;
      progressBar.style.width = '100%';
    } else {
      progressBar.style.height = '100%';
      progressBar.style.width = `${fillPercent}%`;
    }
  });

  // ==========================================================================
  // LÓGICA DO SIMULADOR (GOOGLE AI STUDIO MOCKUP)
  // ==========================================================================
  
  function initSimulator() {
    // Definir estado inicial do simulador
    if (simState.step === 1) {
      simBtnCreateKeyTrigger.classList.add('highlight-pulse');
      simKeyRow.classList.add('hidden');
      simEmptyState.classList.remove('hidden');
      simGuideText.innerHTML = 'Clique no botão de cor vinho <strong>"Create API key"</strong> no simulador acima para iniciar.';
    }
  }

  // Gatilho do Modal
  simBtnCreateKeyTrigger.addEventListener('click', () => {
    if (simState.step === 1) {
      simModal.classList.remove('hidden');
      simState.step = 2;
      simBtnCreateKeyTrigger.classList.remove('highlight-pulse');
      
      // Destacar o botão de criar no modal
      simBtnModalCreate.classList.add('highlight-pulse');
      simGuideText.innerHTML = 'Agora escolha as configurações do projeto e clique em <strong>"Create API key in new project"</strong>.';
    }
  });

  // Fechar Modal
  function closeModal() {
    simModal.classList.add('hidden');
    if (simState.step === 2) {
      simState.step = 1;
      initSimulator();
    }
  }

  simBtnModalClose.addEventListener('click', closeModal);
  simBtnModalCancel.addEventListener('click', closeModal);

  // Criar Chave no Modal
  simBtnModalCreate.addEventListener('click', () => {
    if (simState.step === 2) {
      // Fechar modal
      simModal.classList.add('hidden');
      
      // Gerar chave aleatória falsa
      const randomChars = Math.random().toString(36).substring(2, 15).toUpperCase();
      simState.fakeKey = `AIzaSyD_SIMULATOR_${randomChars}`;
      
      // Atualizar tela do simulador
      simEmptyState.classList.add('hidden');
      simKeyRow.classList.remove('hidden');
      simDisplayKey.innerText = `${simState.fakeKey.substring(0, 15)}...`;
      
      simState.step = 3;
      simState.keyGenerated = true;
      simBtnModalCreate.classList.remove('highlight-pulse');
      
      // Destacar o botão de copiar chave
      simBtnCopyKey.classList.add('highlight-pulse');
      simGuideText.innerHTML = 'Sua chave de API simulada foi gerada! Clique em <strong>"Copiar"</strong> para salvá-la.';
    }
  });

  // Copiar Chave no Simulador
  simBtnCopyKey.addEventListener('click', () => {
    if (simState.step === 3) {
      // Salvar a chave copiada para uso no passo 5
      userKey = simState.fakeKey;
      inputApiKey.value = userKey;
      
      // Feedback visual no simulador
      simBtnCopyKey.innerText = 'Copiado!';
      simBtnCopyKey.style.background = 'var(--color-success)';
      simBtnCopyKey.style.color = '#fff';
      simBtnCopyKey.classList.remove('highlight-pulse');
      
      simGuideText.innerHTML = '🎉 <strong>Excelente!</strong> A chave foi gerada e copiada. Clique em <strong>"Próximo"</strong> para aprender a mantê-la segura.';
      
      // Copiar para a área de transferência real do usuário
      navigator.clipboard.writeText(simState.fakeKey).catch(err => {
        console.warn('Não foi possível copiar para o clipboard real:', err);
      });

      // Habilitar destaque sutil no botão Next do tutorial
      btnNext.classList.add('highlight-pulse');
      setTimeout(() => btnNext.classList.remove('highlight-pulse'), 4000);
    }
  });

  // Inicializar simulator
  initSimulator();


  // ==========================================================================
  // LÓGICA DO GERADOR DE CÓDIGO (TABS & SNIPPETS)
  // ==========================================================================

  // Códigos modelo das integrações
  const snippets = {
    node: {
      file: 'server.js',
      instructions: `
        <h4>Passos para Setup no Node.js:</h4>
        <ol>
          <li>Crie uma pasta no seu projeto e inicialize: <code>npm init -y</code></li>
          <li>Instale a biblioteca oficial do Gemini: <code>npm install @google/genai dotenv</code></li>
          <li>Crie um arquivo chamado <code>.env</code> na raiz do projeto e adicione sua chave lá:
            <pre><code>GEMINI_API_KEY=\${key}</code></pre>
          </li>
          <li>Crie o arquivo <code>server.js</code> com o código acima e execute usando: <code>node server.js</code></li>
        </ol>
      `,
      getCode: (key) => `// Backend Seguro: server.js
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config'; // Carrega a variável GEMINI_API_KEY do arquivo .env

// Inicializa a API buscando a chave automaticamente de process.env.GEMINI_API_KEY
const ai = new GoogleGenAI();

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Olá! Crie um parágrafo chamativo explicando como usar Inteligência Artificial no desenvolvimento web.',
    });

    console.log("Resposta do Gemini:");
    console.log(response.text);
  } catch (error) {
    console.error("Erro ao conectar com a API:", error);
  }
}

run();`
    },
    python: {
      file: 'app.py',
      instructions: `
        <h4>Passos para Setup no Python:</h4>
        <ol>
          <li>Instale o SDK oficial do Gemini: <code>pip install google-genai python-dotenv</code></li>
          <li>Crie um arquivo <code>.env</code> na raiz do seu projeto e defina a variável:
            <pre><code>GEMINI_API_KEY=\${key}</code></pre>
          </li>
          <li>Crie seu script <code>app.py</code> com o código acima.</li>
          <li>Rode no terminal: <code>python app.py</code></li>
        </ol>
      `,
      getCode: (key) => `# Backend Seguro: app.py
import os
from google import genai
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Inicializa o cliente da API. Ele pega automaticamente a chave do ambiente
client = genai.Client()

def ask_gemini():
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Como posso criar uma navegação moderna em CSS?"
        )
        print("Resposta do Gemini:")
        print(response.text)
    except Exception as e:
        print(f"Erro ao chamar a API: {e}")

if __name__ == "__main__":
    ask_gemini()`
    },
    firebase: {
      file: 'index.js',
      instructions: `
        <h4>Setup com Firebase AI Logic:</h4>
        <ol>
          <li>Use o Firebase CLI para iniciar o AI Logic ou Cloud Functions no seu projeto: <code>firebase init functions</code></li>
          <li>Ao invés de programar tudo na mão, configure a extensão oficial <strong>Multimodal Tasks with Gemini</strong> no console do Firebase.</li>
          <li>A extensão gerencia a segurança e rota de chaves por meio do <strong>Google Cloud Secret Manager</strong> automaticamente.</li>
          <li>Chame a função no seu frontend com o SDK do Firebase Functions mostrado acima.</li>
        </ol>
      `,
      getCode: (key) => `// Integração via Firebase Functions / Genkit
import { onRequest } from "firebase-functions/v2/https";
import { GoogleGenAI } from "@google/genai";
import { defineSecret } from "firebase-functions/params";

// Define a chave como segredo seguro no Secret Manager do Firebase
const geminiApiKey = defineSecret("GEMINI_API_KEY");

export const askGeminiSecure = onRequest(
  { secrets: [geminiApiKey] }, 
  async (req, res) => {
    // Configura a API lendo o segredo em ambiente de execução seguro
    const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });
    
    const prompt = req.body.prompt || "Olá Gemini!";
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      
      res.json({ success: true, text: response.text });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);`
    },
    'html-js': {
      file: 'index.html',
      instructions: `
        <h4 style="color: var(--color-danger)">⚠️ AVISO CRÍTICO DE SEGURANÇA:</h4>
        <p><strong>NÃO publique este código na internet!</strong> Ele expõe sua chave pública no navegador. Use este arquivo apenas localmente na sua máquina para testes rápidos (ex: abrindo um arquivo local no seu Chrome).</p>
        <ol>
          <li>Crie um arquivo <code>index.html</code> na sua máquina.</li>
          <li>Cole o código acima.</li>
          <li>Substitua a variável <code>apiKey</code> com a sua chave Gemini.</li>
          <li>Abra o arquivo no seu navegador para testar a chamada.</li>
        </ol>
      `,
      getCode: (key) => `&lt;!-- Apenas para Testes Locais! NÃO envie para a produção! --&gt;
&lt;!DOCTYPE html&gt;
&lt;html lang="pt"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Teste Gemini API&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Consultando o Gemini diretamente do Navegador&lt;/h1&gt;
    &lt;button onclick="perguntarGemini()"&gt;Enviar Prompt&lt;/button&gt;
    &lt;div id="resposta"&gt;Aguardando resposta...&lt;/div&gt;

    &lt;script type="module"&gt;
        // Importa a biblioteca do CDN esm.run
        import { GoogleGenAI } from 'https://esm.run/@google/genai';

        // ATENÇÃO: Sua chave está visível no código-fonte da página!
        const apiKey = "${key}";
        const ai = new GoogleGenAI({ apiKey });

        window.perguntarGemini = async function() {
            const outputDiv = document.getElementById('resposta');
            outputDiv.innerText = 'Processando...';
            
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: 'Olá! Diga olá mundo de forma amigável.'
                });
                outputDiv.innerText = response.text;
            } catch (error) {
                outputDiv.innerText = 'Erro na requisição: ' + error.message;
            }
        }
    &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;`
    }
  };

  function updateCodeSnippet() {
    const activeData = snippets[activeLang];
    
    // Obter o código atualizado com a chave
    let code = activeData.getCode(userKey);
    
    // Atualizar DOM
    codeFilename.innerText = activeData.file;
    codeBlock.innerHTML = code;
    
    // Processar instruções
    // Substituir ${key} na string das instruções para exibir a chave real ou placeholder
    let keyForInstructions = userKey;
    if (userKey === 'SUA_CHAVE_DE_API_GEMINI_AQUI') {
      keyForInstructions = 'SUA_CHAVE_DE_API_GEMINI_AQUI';
    }
    setupNotes.innerHTML = activeData.instructions.replace(/\${key}/g, keyForInstructions);
  }

  // Listener para input de chave do usuário
  inputApiKey.addEventListener('input', (e) => {
    userKey = e.target.value.trim() || 'SUA_CHAVE_DE_API_GEMINI_AQUI';
    updateCodeSnippet();
  });

  // Usar chave simulada
  btnUseSimulated.addEventListener('click', () => {
    if (simState.fakeKey) {
      userKey = simState.fakeKey;
      inputApiKey.value = userKey;
      updateCodeSnippet();
      
      // Efeito de sucesso no botão
      const originalText = btnUseSimulated.innerText;
      btnUseSimulated.innerText = 'Chave carregada!';
      btnUseSimulated.style.borderColor = 'var(--color-success)';
      btnUseSimulated.style.color = 'var(--color-success)';
      setTimeout(() => {
        btnUseSimulated.innerText = originalText;
        btnUseSimulated.style.borderColor = '';
        btnUseSimulated.style.color = '';
      }, 2000);
    } else {
      alert('Você ainda não gerou uma chave no simulador! Volte ao Passo 3 para criá-la.');
    }
  });

  // Lógica de Abas de Código
  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remover active
      codeTabs.forEach(t => t.classList.remove('active'));
      
      // Adicionar active
      tab.classList.add('active');
      activeLang = tab.getAttribute('data-lang');
      
      updateCodeSnippet();
    });
  });

  // Copiar código do snippet
  btnCopySnippet.addEventListener('click', () => {
    // Pega o conteúdo de texto da tag code sem tags HTML escapadas
    const textToCopy = codeBlock.textContent || codeBlock.innerText;
    
    // Cria textarea temporário para copiar com suporte mais amplo
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      
      // Feedback visual
      copyTextSpan.innerText = 'Código Copiado! ✅';
      btnCopySnippet.style.background = 'var(--color-success)';
      btnCopySnippet.style.color = '#fff';
      
      setTimeout(() => {
        copyTextSpan.innerText = 'Copiar Código';
        btnCopySnippet.style.background = '';
        btnCopySnippet.style.color = '';
      }, 2500);
      
    } catch (err) {
      console.error('Falha ao copiar:', err);
    } finally {
      document.body.removeChild(textarea);
    }
  });

  // Inicializar renderização de código padrão
  updateCodeSnippet();

});
