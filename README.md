## Cadastro de Carro

**Requisitos funcionais**
Deve ser possível cadastral um novo carro
Deve ser possível listar todas as categorias

**Regra de negocio**
Não deve ser possível cadastrar um carro com uma placa já existente.
O carro deve ser cadastrado como disponível por padrão
O usuário responsavel pelo cadastro do carro deve ser um admin

**Regra de negocio**


## Listagem de carros

**Requisitos funcionais**
Deve ser possível listar todos os carros disponíveis

**Regra de negocio**
O usuário não precisa estar logado no sistema


## Cadastro de especificação no carro

**Requisitos funcionais**
Deve ser possível cadastrar uma especificação para um carro
Deve ser possível listar todas as especificação
Deve ser possível listar todos os carros

**Regra de negocio**
Não deve ser possível cadastrar uma especificação para um carro não existente
Não deve ser possível cadastrar uma especificação já existente para o mesmo carro
O usuario responsável pelo cadastro deve ser um admin


## Cadastro da imagem do carro

**Requisitos funcionais**
Deve ser possível cadastrar as imagens do carro
Deve ser possível listar todos os carros

**Requisitos não funcionais**
Utilizar o multer para upload de arquivos

**Regra de negocio**
O usuário deve poder cadastrar mais de uma imagem ao carro
Apenas usuários admin devem poder cadastrar imagem


## Aluguel do carro

**Requisitos funcionais**
Deve ser possível cadastrar o aluguel

**Regra de negocio**
O aluguel deve ter duração mínima de 24h de duração
Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo usuário
Não deve ser possível cadastrar um novo aluguel caso já exista um aberto para o mesmo carro
