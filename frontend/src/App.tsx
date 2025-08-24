import Navbar from "./components/Navbar"
import ApplicantForm from "./components/ApplicantForm"
import { DataProvider } from "./contexts/DataContext"
import { FormProvider } from "./contexts/FormContext"
import TabsContainer from "./components/core/TabsContainer"
import TabView from "./components/core/TabView"
import RiskView from "./components/RiskView"
import InterestView from "./components/InterestView"

function App() {

  return (
    <>
      <header>
        <nav className="bg-gray-800">
          <Navbar />
        </nav>
      </header>
      <main className="container mx-auto px-4 pt-4">
        <section>
          <div className="pb-10">
            <h1 className="header1">Loan Risk Analyser</h1>
            <p>Enter loan applicant information manually or use the preset buttons.</p>
            <p>Click the <strong>Predict risk</strong> button to see predictions of default risk and the recommended interest rate.</p>
          </div>
        </section>
        <section>
          <DataProvider>
            <FormProvider>
              <div className="border-b mb-2 w-full items-center"><h2 className="header2 text-center">Loan & Applicant Information</h2></div>
              <ApplicantForm />

              <div className="py-2"></div>
              <div className="border-b mb-2 w-full items-center"><h2 className="header2 text-center">Predictions & Calculations</h2></div>
              <TabsContainer>
                <TabView label="Base Risk Prediction"><RiskView /></TabView>
                <TabView label="Interest Calculation"><InterestView /></TabView>
              </TabsContainer>

            </FormProvider>
          </DataProvider>
        </section>
        
      </main>
      <footer className="py-12"></footer>
    </>
  )
}

export default App
