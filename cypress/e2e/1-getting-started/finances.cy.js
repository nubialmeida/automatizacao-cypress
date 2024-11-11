context('Dev finances ', () => {

    beforeEach(() => {
        cy.visit('https://my-devfinances.netlify.app')
        cy.get('#data-table tbody tr').should('have.length', 0)
    });

    it('Cadastrar entradas', () => {
        cy.get('#transaction .button').click()
        cy.get('#description').type('Mesada')
        cy.get('[name=amount]').type(12)
        cy.get('[type=date]').type('2024-03-10')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length', 1)
    });

    it('Cadastrar saídas', () => {
        cy.get('#transaction .button').click()
        cy.get('#description').type('Mesada')
        cy.get('[name=amount]').type(-12)
        cy.get('[type=date]').type('2024-03-10')
        cy.get('button').contains('Salvar').click()

        cy.get('#data-table tbody tr').should('have.length', 1)
    });

    it('Remover entradas e saídas', () => {
        const entrada = 'Total'
        const saída = 'brownie'

        cy.get('#transaction .button').click()
        cy.get('#description').type(entrada)
        cy.get('[name=amount]').type(100)
        cy.get('[type=date]').type('2024-03-10')
        cy.get('button').contains('Salvar').click()

        cy.get('#transaction .button').click()
        cy.get('#description').type(saída)
        cy.get('[name=amount]').type(-16)
        cy.get('[type=date]').type('2024-03-10')
        cy.get('button').contains('Salvar').click()

        // Remover entrada
        cy.get('td.description')
            .contains(entrada)
            .parent()
            .find('button[onclick*=remove]')
            .click();

        // Remover saída
        cy.get('td.description')
            .contains(saída)
            .parent()
            .find('button[onclick*=remove]')
            .click();

        // Verificar que a tabela está vazia
        cy.get('#data-table tbody tr').should('have.length', 0);
    });

    it.only("Validar saldo com diversas transações", () => {
        const saída = 'brownie';

        cy.get('#transaction .button').click()
        cy.get('#description').type('Mesada')
        cy.get('[name=amount]').type(-12)
        cy.get('[type=date]').type('2024-03-10')
        cy.get('button').contains('Salvar').click()

        cy.get('#transaction .button').click()
        cy.get('#description').type(saída)
        cy.get('[name=amount]').type(-16)
        cy.get('[type=date]').type('2024-03-10')
        cy.get('button').contains('Salvar').click()

        // Verificar todas as transações
        cy.get('#data-table tbody tr')
            .each(($el, index) => {
                cy.wrap($el).find('td.income, td.expense')
                    .invoke('text')
                    .then(text => {
                        cy.log('Transação ' + (index + 1) + ': ' + text);  // Logando o texto das transações
                    });
            });
    });
});
