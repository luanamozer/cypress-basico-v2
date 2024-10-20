/// <reference types="Cypress" /> //
import '../support/commands'

describe('Central de Atendimento ao Cliente TAT', function() {

    beforeEach(()=>{
        cy.visit('./src/index.html')

    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function(){

        const longText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'

        cy.get('#firstName').type('Luana')
        cy.get('#lastName').type('mozzer')
        cy.get('#email').type('luana@testes.com')

        cy.get('#open-text-area').type(longText,  // segundo argumento do metodo type, pode receber um objeto com diferentes propriedades, consultar doc cypress type
        {
            delay:0  // propriedade que sobrescreve o tempo padrão de execução(digitação) do cypress, que são 10s, passando 0, ele executará os testes mais rapido
        })


        cy.get('button[type="submit"]').click()

        cy.get('.success')
        .should('be.visible')
    })

   
    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.get('#firstName').type('Luana')
        cy.get('#lastName').type('mozzer')
        cy.get('#email').type('luana@testes,com') // email invalido com ,

        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible') // valida se aparece a msg de erro pelo elemento com a classe .error 
    })

    it('campo telefone continua vazio quando preenchido com valor não-numerico', function(){
        cy.get('#phone')
        .type('abcbeeuge')
        .should('have.value', '')

    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.get('#firstName').type('Luana')
        cy.get('#lastName').type('mozzer')
        cy.get('#email').type('luana@testes.com')

        cy.get('#phone-checkbox').check()  //clicou no campo checkbox do telefone, o telefone se torna preenchimento obrigatorio

        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible') // a msg de erro deve aparecer porque o checkbox de telefone foi selecionado, mas não foi preenchido
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        //nome
        cy.get('#firstName')
        .type('Luana')
        .should('have.value', 'Luana')
        .clear() // função que limpa o campo após ser preenchido
        .should('have.value', '')
       
        // sobrenome
        cy.get('#lastName')
        .type('mozzer')
        .should('be.value', 'mozzer')
        .clear()
        .should('have.value', '')

        // email
        cy.get('#email')
        .type('luana@testes.com')
        .should('have.value', 'luana@testes.com')
        .clear()
        .should('have.value', '')

        //telefone
        cy.get('#phone')
        .type('12345678')
        .should('have.value', '12345678')
        .clear()
        .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.contains('button', 'Enviar').click() // encontrando o elemento botão usando o metodo contains (primeiro argumento é o seletor, o segundo é o texto contido nele)
        cy.get('.error').should('be.visible') // verifica que um elemento com a classe errorr (.error) está visivel na tela
    })

    /// comando custom que foi criado na pasta support arquivo commands.js
    
    it('envia o formuário com sucesso usando um comando customizado', function(){
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    
    })

    // selecionando opçoes em um dropdown

    it('seleciona um produto (YouTube) por seu texto', function(){
        cy.get('#product')
        .select('YouTube') // selecionando por texto
        .should('have.value', 'youtube')
    })


    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product')
        .select('mentoria') // selecionando no dropdown o value definido no atributo do html
        .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice do array (1)', function(){
        cy.get('#product')
        .select(1) // selecionando no dropdown o indice do array
        .should('have.value', 'blog') 
    })

    // marcando inputs do tipo radio button (seleçao unica)ts

    it('marca um unico tipo de atendimento "Feedback"', function(){
        cy.get('input[type="radio"][value="feedback"]')
        .check() // marca/clica 
        .should('have.value', 'feedback') // verificaçao que o valor correto(feedback) foi selecionado apos o check
    })

    it('marca cada tipo de atendimento', function(){
        cy.get('input[type="radio"]') //pega todos inputs do tipo radio
        .should('have.length',3) //verifica se o tamanho/quantidade de inputs sao 3
        .each(function($radio){ // funçao each percorre o array, declara o $radio como se fosse uma variavel
            cy.wrap($radio).check() // vai clicando em cada radio button q tem no array
            cy.wrap($radio).should('be.checked') // verifica se foi marcado o radio button

        })
    })

    it('marca ambos checkboxes, depois desmarca o ultimo', function(){
        cy.get('input[type="checkbox"]') // pega todos checboxes pois não especificou nenhum
        .check() // marca/check
        .should('be.checked') // valida se os foram marcados
        .last() // funçao q pega o ultimo checkado
        .uncheck() // funçao q desmacar o check * nesse caso esta desmacando o check do telefone q é o ultimo checkado *
        .should('not.be.checked') // valida se esta desmarcado
    })
  })
  