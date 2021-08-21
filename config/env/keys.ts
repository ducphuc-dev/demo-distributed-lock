import keysStag from './staging'
import keysDev from './development'
let env: any

if (process.env.NODE_ENV === 'development') {
  env = keysDev
} else if (process.env.NODE_ENV === 'staging') {
  env = keysStag
}
const keys = env
export default keys
