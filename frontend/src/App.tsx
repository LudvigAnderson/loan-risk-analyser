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
      <main className="container mx-auto px-4">
        <section>
          <DataProvider>
            <FormProvider>

              <ApplicantForm />

              <div className="py-2"></div>

              <TabsContainer>
                <TabView label="Base Risk Prediction"><RiskView /></TabView>
                <TabView label="Interest Calculation"><InterestView /></TabView>
              </TabsContainer>

            </FormProvider>
          </DataProvider>
        </section>
        
      </main>

    </>
  )
}

export default App
