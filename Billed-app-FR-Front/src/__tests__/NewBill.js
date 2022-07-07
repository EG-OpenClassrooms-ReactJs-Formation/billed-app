/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from '@testing-library/user-event'
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
    
  
  // describe("When I am on NewBill Page", () => {
  //   test("Then handle a change of file", async () => {
      
      
  //     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  //       window.localStorage.setItem('user', JSON.stringify({
  //         type: 'Employee'
  //       }))
  //       const html = NewBillUI()
  //       document.body.innerHTML = html
  //       const onNavigate = (pathname) => {
  //         document.body.innerHTML = ROUTES({ pathname })
  //       }
        
  //       const store = mockStore
        
  //       const newBill = new NewBill ({
  //         document, onNavigate, store, localStorage: window.localStorage
  //       })
  //       const handleChangeFile = jest.fn(newBill.handleChangeFile)
        
  //       const file = screen.getAllByTestId('file')
        
        
  //       if (file) file.forEach(item => {
  //         item.addEventListener('change', () => handleChangeFile)
  //       })
  //       console.log(file)
        
  //       //file.simulate(`change`, {preventDefault: jest.fn()});
  //       //fireEvent.submit(file[0])
  //       //expect(handleChangeFile).toHaveBeenCalled()
  //   })
  // }),
  describe("When I am on NewBill Page", () => {
    test("Then uploading a new file change the NewBill file information", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      
      let file = new File(['test'], 'test.png', { type: 'image/png' });
      Object.defineProperty(document.querySelector(`input[data-testid="file"]`), 'files', {
        value: [file],
        configurable: true
      })
     

      let newFile = new File(['test'], 'test.jpg', { type: 'image/jpg' });
      fireEvent.change(document.querySelector(`input[data-testid="file"]`), { 
            target: {
              files: [newFile]
            }})
      
      let newBill = new NewBill({ document: document, onNavigate: null, store: mockStore, localStorage:localStorage })
      
      expect(newBill.handleChangeFile).toThrow(TypeError);     

    })
      
      
    }),

    test("Then I can't create a new bill without a correct image file",  () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
      const html = NewBillUI()
      document.body.innerHTML = html
      
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES_PATH.NewBill
      }
      let file = new File(['test'], 'test.webp', { type: 'image/webp' });

      Object.defineProperty(document.querySelector(`input[data-testid="file"]`), 'files', {
        value: [file]
      })

      let newBill = new NewBill({ document: document, onNavigate: onNavigate, store: mockStore, localStorage:localStorage })
      
      
      newBill.fileName = file.name
      
      newBill.fileUrl = "./justificatifs/" + newBill.fileName
      const alertFunction   = jest.fn(window.alert )
      const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
      fireEvent.submit(alertFunction)

      expect(alertFunction).toHaveBeenCalled()
    }),

    describe("When I am on NewBill Page", () => {
      test("The a file can handle a submit", () => {

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES_PATH.NewBill
        }
        const html = NewBillUI()
        document.body.innerHTML = html

        let file = new File(['test'], 'test.png', { type: 'image/png' });
        Object.defineProperty(document.querySelector(`input[data-testid="file"]`), 'files', {
          value: [file],
          configurable: true
        })
        

        let newBill = new NewBill({ document: document, onNavigate: onNavigate, store: mockStore, localStorage:localStorage })
        
        const handleSubmit  = jest.fn(newBill.handleSubmit)
        const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
        fireEvent.submit(formNewBill)
        expect(handleSubmit).toHaveBeenCalled()
        
      })
      
      test("The a file can handle a submit change", () => {

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES_PATH.NewBill
        }
        const html = NewBillUI()
        document.body.innerHTML = html

        let file = new File(['test'], 'test.png', { type: 'image/png' });
        Object.defineProperty(document.querySelector(`input[data-testid="file"]`), 'files', {
          value: [file],
          configurable: true
        })
        

        let newBill = new NewBill({ document: document, onNavigate: onNavigate, store: mockStore, localStorage:localStorage })
        //const handleChangeFile   = jest.fn().mockName('newBill.handleChangeFile');
        const handleChangeFile   = jest.fn(newBill.handleChangeFile )
        const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
        fireEvent.submit(formNewBill)
        expect(handleChangeFile).toHaveBeenCalled()
        
      })
        
      })
  })
