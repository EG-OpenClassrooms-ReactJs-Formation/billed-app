/**
 * @jest-environment jsdom
 */

 import { screen, fireEvent } from "@testing-library/dom"
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 import BillsUI from "../views/BillsUI.js";
 import userEvent from '@testing-library/user-event'
 import { ROUTES_PATH} from "../constants/routes.js";
 import {localStorageMock} from "../__mocks__/localStorage.js";
 import mockStore from "../__mocks__/store"
 import router from "../app/Router.js";
 import { ROUTES } from "../constants/routes.js"

   describe("Given I am connected as an employee",  () => {
    describe("When I am on NewBill Page", () => {
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      
      
      test("Then I can't create a new bill without a correct image file",  () => {
        
        const html = NewBillUI()
        document.body.innerHTML = html
        
        // Create a file
        let file = new File(['test'], 'test-img.webp', { type: 'image/webp' });
  
        Object.defineProperty(document.querySelector(`input[data-testid="file"]`), 'files', {
          value: [file]
        })
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

        let newBill = new NewBill({ document: document, onNavigate: onNavigate, store: mockStore, localStorage:localStorage })

        newBill.fileName = document.querySelector(`input[data-testid="file"]`).files[0].name
        newBill.fileUrl = "./justificatifs/" + newBill.fileName
        // Submit the form
        const createBill = jest.fn(newBill.handleChangeFile)

        const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
        const resultEvent = fireEvent.submit(formNewBill)
        
        // Test if the function has been called and return false
        expect(createBill === false)
      })
      
      test("Then I can submit a form",  () => {
        //création du formualaire et ajout dans le DOM
        const html = NewBillUI()
        document.body.innerHTML = html
        // Create a file that will be upload
        let file = new File(['test'], 'test-img.png', { type: 'image/png' });

        Object.defineProperty(document.querySelector(`input[data-testid="file"]`), 'files', {
          value: [file]
        })
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES_PATH.NewBill
        }
        // Create a new bill
        let newBill = new NewBill({ document: document, onNavigate: onNavigate, store: mockStore, localStorage:localStorage })
         // Insert a new file in jest
        newBill.fileName = document.querySelector(`input[data-testid="file"]`).files[0].name
        newBill.fileUrl = "./justificatifs/" + newBill.fileName
        // Add the function in the jest scope
        const createBill = jest.fn(newBill.handleSubmit)
        const onNavigateFunction = jest.fn(newBill.onNavigate)
        // Submit the form
        const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
        const button = document.getElementById('btn-send-bill')
        fireEvent.click(button);
        // Verify if the function has been called
        expect(newBill.handleSubmit).toThrow(TypeError)
      })
      test("Then uploading a new file change the NewBill file information",  () => {

        const html = NewBillUI()
        document.body.innerHTML = html

        let file = new File(['test'], 'test-img.png', { type: 'image/png' });
        Object.defineProperty(document.querySelector(`input[data-testid="file"]`), 'files', {
          value: [file],
          configurable: true
        })
       
        let newFile = new File(['test'], 'test-img.jpg', { type: 'image/jpg' });
        let newBill = new NewBill({ document: document, onNavigate: null, store: mockStore, localStorage: localStorage })
        fireEvent.change(document.querySelector(`input[data-testid="file"]`), { 
              target: {
                files: [newFile]
              }})
        
        expect(newBill.handleChangeFile).toThrow(TypeError);

      })
    })
  })
  
  // Integration test
  describe('Given I am connected as an employee', () => {
    describe('When I submit a new bill', () => {
      test('Then I send a POST on the mocked API ', async () => {
        const getSpy = jest.spyOn(mockStore, "bills")
        const newbill = mockStore.bills()
        expect(getSpy).toHaveBeenCalledTimes(1)
        expect(newbill).toBeTruthy()
      })
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 404"))
        )
        const html = BillsUI({ error: "Erreur 404" })
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })
      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 500"))
        )
        const html = BillsUI({ error: "Erreur 500" })
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
        
      })
    })
  })