import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import App from "../App.jsx";
import {ClientCard} from "../components/clients/ClientCard.jsx";
import {ClientForm} from "../components/clients/ClientForm.jsx";
import {Sidebar} from "../components/sidebars/Sidebar.jsx";

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path="/App">
        <App />
      </ComponentPreview>
      <ComponentPreview path="/ClientCard">
        <ClientCard />
      </ComponentPreview>
      <ComponentPreview path="/ClientForm">
        <ClientForm />
      </ComponentPreview>
      <ComponentPreview path="/Sidebar">
        <Sidebar />
      </ComponentPreview>
    </Previews>
  )
}

export default ComponentPreviews