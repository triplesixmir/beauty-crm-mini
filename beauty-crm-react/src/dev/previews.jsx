import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import App from "../App.jsx";
import {ClientCard} from "../components/ClientCard.jsx";
import {ClientForm} from "../components/ClientForm.jsx";

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
    </Previews>
  )
}

export default ComponentPreviews