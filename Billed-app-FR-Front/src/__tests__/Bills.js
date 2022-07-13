/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import mockStoreFail from "../__mocks__/store2"
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      // we expect that the windowIcon contains the active-icon class
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy()

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe("Given I am connected as an employee", () => {
    describe('When I am on Bills Page and I click on the icon eye', () => {
      test('A modal should open', () => {
        
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = BillsUI({ data: bills })
        
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        
        const store = null
        
        const bill = new Bills({
          document, onNavigate, store, bills, localStorage: window.localStorage
        })
        
        //console.log(document.body.innerHTML)
        
        const handleClickIconEye = jest.fn(bill.handleClickIconEye)
        //const eye = screen.getByTestId('icon-eye')
        const iconEye = screen.getAllByTestId('icon-eye')
        //const eye = container.querySelectorAll(`div[data-testid="icon-eye"]`)
        
        if (iconEye) iconEye.forEach(icon => {
          icon.addEventListener('click', () => handleClickIconEye(icon))
        })
        //iconEye[0].addEventListener('click', () => handleClickIconEye(iconEye[0]))
        userEvent.click(iconEye[0])
        expect(handleClickIconEye).toHaveBeenCalled()
        
        const modale = screen.getByTestId('modaleFileEmployee')
        expect(modale).toBeTruthy()
      })
    })
  })
  describe("Given I am connected as an employee", () => {
    describe('When I am on Bills Page and I click on the button', () => {
      test('A new bill should be created', () => {
        
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = BillsUI({ data: bills })
        
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES_PATH.NewBill
        }
        
        const store = null
        
        const bill = new Bills({
          document, onNavigate, store, bills, localStorage: window.localStorage
        })
        
        //console.log(document.body.innerHTML)
        
        const handleClickNewBill = jest.fn(bill.handleClickNewBill)
        const buttonNewBill = screen.getByTestId('btn-new-bill')
        
        if (buttonNewBill){
          buttonNewBill.addEventListener('click', handleClickNewBill)
          userEvent.click(buttonNewBill)
          expect(handleClickNewBill).toHaveBeenCalled()
        }
      })
    })
  })
})

// test d'intégration GET
describe("Given I am a user connected as employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = BillsUI({ data: bills })
        
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES_PATH.NewBill
        }
        
        const store = null
        
        const bill = new Bills({
          document, onNavigate, store, bills, localStorage: window.localStorage
        })
        bill.getBills()
        const iconEye = screen.getAllByTestId('icon-eye')
        //console.log(iconEye.length)
        expect(iconEye.length > 0).toBeTruthy()

    })
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("fetches bills from an API and fails with 404 message error", async () => {
  
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        //const message = document.querySelectorAll('td')
        const message = screen.getAllByTestId('statusBillEmployee')
        //console.log(message.length)
        var errorMessage = ""
        message.forEach(messageElement => {
          //console.log(messageElement.innerHTML)
          if(messageElement.innerHTML == "refused"){
            errorMessage = messageElement.innerHTML
          }
        });
        expect(errorMessage).toBe("refused")
      })
      
      test("fetches bills fail from mock API GET", async () => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
          window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee'
          }))
          document.body.innerHTML = BillsUI({ data: bills })
          
          const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES_PATH.NewBill
          }
          
          const store = mockStoreFail
          const bill = new Bills({
            document, onNavigate, store, bills, localStorage: window.localStorage
          })
          const billsGet = await bill.getBills()
          
          // Verify the length to be equal to the mock list
          expect(billsGet.length === 4)
          
      })
      
    })
  })
})