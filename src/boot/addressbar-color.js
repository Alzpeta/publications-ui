// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
import {AddressbarColor, getCssVar} from 'quasar'

export default () => {
  AddressbarColor.set(getCssVar('primary'))
}
