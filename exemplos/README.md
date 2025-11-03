# Arquivos de Exemplo para Upload

Esta pasta contém arquivos CSV de exemplo para testar a funcionalidade de upload e geração de gráficos.

## Arquivos Disponíveis

### 1. vendas-trimestrais.csv
Dados de vendas por trimestre com metas e crescimento.

**Colunas**:
- `trimestre`: Período (Q1-Q4 2024)
- `vendas`: Valor de vendas em R$
- `meta`: Meta estabelecida em R$
- `crescimento`: Percentual de crescimento

**Sugestões de gráficos**:
- Gráfico de barras comparando vendas vs meta
- Gráfico de linha mostrando evolução das vendas
- Gráfico de área mostrando crescimento

### 2. usuarios-mensais.csv
Métricas de usuários e receita mensal.

**Colunas**:
- `mes`: Mês de referência
- `novos_usuarios`: Quantidade de novos usuários
- `usuarios_ativos`: Total de usuários ativos
- `taxa_conversao`: Taxa de conversão em %
- `receita`: Receita em R$

**Sugestões de gráficos**:
- Gráfico de linha mostrando crescimento de usuários
- Gráfico de área comparando novos vs ativos
- Gráfico de barras de receita mensal

### 3. produtos-vendas.csv
Dados de produtos com vendas e estoque.

**Colunas**:
- `produto`: Nome do produto
- `categoria`: Categoria do produto
- `vendas`: Quantidade vendida
- `estoque`: Quantidade em estoque
- `preco_medio`: Preço médio em R$

**Sugestões de gráficos**:
- Gráfico de barras de produtos mais vendidos
- Gráfico de pizza por categoria
- Gráfico de dispersão vendas vs estoque

## Como Usar

1. Na aplicação, clique em "Carregar Arquivo de Dados"
2. Selecione um dos arquivos desta pasta
3. O sistema irá processar e sugerir um gráfico automaticamente
4. Você pode ajustar a descrição conforme necessário
5. Clique em "Gerar Gráfico"

## Criando Seus Próprios Arquivos

### Estrutura Recomendada

```csv
coluna1,coluna2,coluna3
valor1,valor2,valor3
valor4,valor5,valor6
```

### Regras Importantes

1. **Primeira linha**: Deve conter os nomes das colunas
2. **Separador**: Use vírgula (,)
3. **Encoding**: UTF-8
4. **Tamanho máximo**: 10MB
5. **Linhas máximas**: 10.000

### Tipos de Dados

- **Texto**: Categorias, nomes, descrições
- **Números**: Vendas, quantidades, valores
- **Datas**: Use formato ISO (YYYY-MM-DD) ou texto simples
- **Percentuais**: Use números (8.5 para 8.5%)

### Exemplo de Estrutura Ideal

```csv
categoria,valor_numerico,data
Categoria A,100,2024-01
Categoria B,200,2024-02
Categoria C,150,2024-03
```

## Formatos Suportados

- ✅ **CSV** (.csv) - Recomendado
- ✅ **Excel** (.xlsx, .xls)

## Dicas para Melhores Resultados

1. **Use nomes de colunas claros**: "vendas" em vez de "vlr_vnd"
2. **Evite caracteres especiais** nos nomes de colunas
3. **Mantenha dados consistentes**: Mesmo formato em toda coluna
4. **Não use células mescladas** em Excel
5. **Remova linhas vazias** no final do arquivo
6. **Use apenas uma planilha** em arquivos Excel

## Exemplos de Prompts

Após carregar os arquivos, experimente:

### Para vendas-trimestrais.csv:
- "Crie um gráfico de barras comparando vendas e meta"
- "Mostre a evolução das vendas trimestrais"
- "Faça um gráfico de crescimento percentual"

### Para usuarios-mensais.csv:
- "Mostre a evolução de novos usuários"
- "Compare usuários novos vs ativos"
- "Crie um gráfico de receita mensal"

### Para produtos-vendas.csv:
- "Mostre os 5 produtos mais vendidos"
- "Crie um gráfico de vendas por categoria"
- "Compare vendas com estoque disponível"

