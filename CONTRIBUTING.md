# 🤝 Contribuindo para o Generative UI Charts Guide

Obrigado pelo seu interesse em contribuir! Este documento fornece diretrizes para contribuições ao projeto.

## 📋 Código de Conduta

Ao participar deste projeto, você concorda em:

- ✅ Ser respeitoso e inclusivo
- ✅ Aceitar críticas construtivas
- ✅ Focar no que é melhor para a comunidade
- ✅ Mostrar empatia com outros membros

## 🚀 Como Contribuir

### Reportar Bugs

Se você encontrou um bug:

1. **Verifique** se já não existe uma issue sobre o problema
2. **Crie** uma nova issue com:
   - Título claro e descritivo
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Versão do Node.js, navegador, etc.

### Sugerir Melhorias

Para sugerir uma nova funcionalidade:

1. **Abra** uma issue com o label `enhancement`
2. **Descreva** a funcionalidade em detalhes
3. **Explique** por que seria útil
4. **Forneça** exemplos de uso

### Pull Requests

1. **Fork** o projeto
2. **Crie** uma branch para sua feature:
   ```bash
   git checkout -b feature/MinhaFeature
   ```

3. **Desenvolva** seguindo as diretrizes abaixo

4. **Commit** suas mudanças:
   ```bash
   git commit -m "feat: adiciona MinhaFeature"
   ```

5. **Push** para sua branch:
   ```bash
   git push origin feature/MinhaFeature
   ```

6. **Abra** um Pull Request

## 📝 Diretrizes de Código

### TypeScript

```typescript
// ✅ BOM: Type safety completo
interface ChartData {
  name: string;
  value: number;
}

function processData(data: ChartData[]): number {
  return data.reduce((sum, item) => sum + item.value, 0);
}

// ❌ RUIM: any e sem tipos
function processData(data: any) {
  return data.reduce((sum, item) => sum + item.value, 0);
}
```

### Componentes React

```typescript
// ✅ BOM: Functional component com tipos
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary' 
}) => {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {children}
    </button>
  );
};

// ❌ RUIM: Sem tipos e props desestruturadas
export const Button = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};
```

### Nomenclatura

- **Componentes**: PascalCase (`ChartRenderer`, `FileUpload`)
- **Funções**: camelCase (`handleClick`, `processData`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Interfaces**: PascalCase com prefixo I opcional (`ChartData`, `IChartData`)
- **Types**: PascalCase (`ChartType`)

### Comentários

```typescript
// ✅ BOM: JSDoc para funções públicas
/**
 * Processa dados de um arquivo CSV
 * @param file - Arquivo a ser processado
 * @returns Promise com dados parseados
 * @throws Error se arquivo for inválido
 */
async function parseCSV(file: File): Promise<FileData> {
  // Implementação
}

// ✅ BOM: Comentários explicativos
// Limitar a 10.000 linhas para evitar sobrecarga de memória
const MAX_ROWS = 10000;

// ❌ RUIM: Comentários óbvios
// Incrementa i
i++;
```

## 🎨 Estilização

### Tailwind CSS

```tsx
// ✅ BOM: Classes organizadas e legíveis
<div className="
  flex items-center justify-between
  p-4 rounded-lg
  bg-slate-900 border border-slate-700
  hover:bg-slate-800 transition-colors
">
  {children}
</div>

// ❌ RUIM: Classes desorganizadas
<div className="flex bg-slate-900 p-4 items-center border-slate-700 rounded-lg border justify-between hover:bg-slate-800 transition-colors">
  {children}
</div>
```

### Organização de Classes

1. **Layout**: flex, grid, position
2. **Tamanho**: width, height, padding, margin
3. **Aparência**: background, border, color
4. **Texto**: font, text-align
5. **Estados**: hover, focus, active
6. **Animações**: transition, animate

## 📚 Documentação

### Documentando Funcionalidades

Ao adicionar uma nova funcionalidade:

1. **Atualize** o README.md se necessário
2. **Crie** ou atualize documentação em `/docs`
3. **Adicione** exemplos de uso
4. **Inclua** testes (quando aplicável)

### Formato de Documentação

```markdown
# Título da Funcionalidade

## 🎯 Objetivo
Breve descrição do que faz

## 📚 Como Usar
Exemplos práticos

## 🔧 Implementação
Detalhes técnicos

## ⚠️ Limitações
O que não faz ou limitações conhecidas

## 📖 Referências
Links relacionados
```

## 🧪 Testes

### Testes Manuais (Atual)

Antes de submeter um PR, teste:

1. **Funcionalidade básica**: Criar gráfico com texto
2. **Upload de arquivo**: CSV e Excel
3. **Histórico**: Salvar e restaurar
4. **Ajustes**: Modificar gráfico existente
5. **Responsividade**: Desktop e mobile

### Checklist de PR

- [ ] Código está funcionando
- [ ] Não introduz erros de linting
- [ ] Testado em Chrome e Firefox
- [ ] Responsivo (se aplicável)
- [ ] Documentação atualizada
- [ ] Commits seguem padrão

## 📦 Estrutura de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição curta

Descrição longa (opcional)

Footer (opcional)
```

### Tipos

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Formatação, ponto e vírgula, etc.
- `refactor`: Refatoração de código
- `test`: Adição de testes
- `chore`: Tarefas de manutenção

### Exemplos

```
feat(charts): adiciona gráfico de radar

Implementa novo tipo de gráfico radar com suporte a
múltiplas séries de dados e animações.

Closes #123
```

```
fix(upload): corrige validação de tamanho de arquivo

Arquivos menores que 1KB não eram aceitos devido a
bug na comparação.

Fixes #456
```

```
docs(readme): atualiza instruções de instalação

Adiciona passo para configurar variável de ambiente
e exemplo de arquivo .env.local
```

## 🎯 Áreas que Precisam de Ajuda

Contribuições são especialmente bem-vindas em:

- **🧪 Testes**: Unit tests, integration tests, e2e
- **📊 Novos Gráficos**: Radar, Gauge, Heatmap, etc.
- **🌐 Internacionalização**: Suporte a outros idiomas
- **♿ Acessibilidade**: Melhorias de a11y
- **📱 Mobile**: Otimizações para mobile
- **📚 Documentação**: Tutoriais, exemplos, vídeos
- **🐛 Bugs**: Correções de bugs conhecidos

## ❓ Dúvidas?

- Abra uma [Discussion](https://github.com/seu-usuario/generative-ui-charts-guide/discussions)
- Comente em uma issue relacionada
- Entre em contato via email (se disponível)

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença MIT do projeto.

---

**Obrigado por contribuir! 🎉**

Cada contribuição, não importa o tamanho, ajuda a tornar este projeto melhor para todos.

